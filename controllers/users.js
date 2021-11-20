const { sendVerifyEmail } = require('../utils/email');
const User = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

const verifyEmail = async (req, res, next) => {
  // set success status code based on registration or password reset
  const successCode = req.url === '/register' ? 201 : 200;

  // Declare user variable
  let user;

  // If request for code resend
  if (req.url.includes('/resend')) {
    // Check for valid ID
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        msg: `Invalid user ID`,
      });
    }
    // find user by request parameter id
    try {
      user = await User.findById(req.params.id);
    } catch (e) {
      return res.status('400').json({ success: false, msg: e.message });
    }
    // if no user is found
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: `No user found with id: ${req.params.id}`,
      });
    }
    // if verification code is null, verification was never initialized
    if (user.verificationCode === null) {
      return res
        .status(400)
        .json({ success: false, msg: 'Verification not initialized' });
    }
  } else {
    // store user from request body
    user = req.body;
  }

  // generate email verification code
  const verificationCode = await user.getVerificationCode();

  // save updated user information in database
  user.save({ validateBeforeSave: false });

  // send email with verification code
  await sendVerifyEmail(user.emailAddress, user.firstName, verificationCode);

  // return success status code, user data, status message
  res
    .status(successCode)
    .json({ success: true, data: user, msg: 'Verification email sent' });
};

const register = async (req, res, next) => {
  // set variables from input fields
  const { emailAddress, firstName, lastName, password } = req.body;

  if (!isValidEmail(emailAddress))
    return res.status('400').json({ success: false, msg: 'Invalid email' });
  else if (!isValidPassword(password))
    return res.status('400').json({
      success: false,
      msg: 'Password must be between 6 and 10 characters',
    });

  // create new user with entered data
  let user;
  try {
    user = await User.create({
      emailAddress,
      firstName,
      lastName,
      password,
    });
  } catch (e) {
    return res.status('400').json({ success: false, msg: e.message });
  }

  // set request body to new user
  req.body = user;

  // call next
  next();
};

const confirmEmail = async (req, res, next) => {
  // store verification code from request body
  const { verificationCode } = req.body;

  // Check for valid ID
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      msg: `Invalid user ID`,
    });
  }

  // find user by passed in user id
  let user;
  try {
    user = await User.findById(req.params.id);
  } catch (e) {
    return res.status('400').json({ success: false, msg: e.message });
  }

  // if no user is found
  if (!user) {
    return res
      .status(400)
      .json({ success: false, msg: `No user found with id: ${req.params.id}` });
  }

  // If no verification code stored, return unauthorized
  if (user.verificationCode === null)
    return res
      .status(401)
      .json({ success: false, msg: 'Please enter a verification code' });

  // see if date is past verification expiry
  if (Date.now() > user.verificationExpire) {
    user.verificationCode = null;
    user.verificationExpire = null;
    await user.save();
    res.status(401).json({ success: false, msg: 'Code expired' });

    // if verification code matches
  } else if (await user.matchVerificationCode(verificationCode)) {
    user.emailConfirmed = true;
    user.verificationCode = null;
    user.verificationExpire = null;
    await user.save();
    res.status(200).json({ success: true, data: user, msg: 'Email confirmed' });
  } else {
    res.status(401).json({ success: false, msg: 'Invalid code' });
  }
};

const forgotPassword = async (req, res, next) => {
  // set variables from input fields
  const { emailAddress } = req.body;

  // find user with entered data
  let user;
  try {
    user = await User.findOne({ emailAddress });
  } catch (e) {
    return res.status('400').json({ success: false, msg: e.message });
  }

  // if no user is found
  if (!user) {
    return res.status(400).json({
      success: false,
      msg: `No user found with email: ${emailAddress}`,
    });
  }

  // set request body to new user
  req.body = user;

  // call next
  next();
};

const resetPassword = async (req, res, next) => {
  // store verification code and new password from request body
  const { verificationCode, newPassword } = req.body;

  // Check for valid ID
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      msg: `Invalid user ID`,
    });
  } else if (!isValidPassword(newPassword))
    return res.status(400).json({
      success: false,
      msg: `Password must be between 6 and 10 characters`,
    });

  // find user by passed in user id
  let user;
  try {
    user = await User.findById(req.params.id);
  } catch (e) {
    return res.status('400').json({ success: false, msg: e.message });
  }

  // if no user is found
  if (!user) {
    return res
      .status(400)
      .json({ success: false, msg: `No user found with id: ${req.params.id}` });
  }

  // If no verification code stored, return unauthorized
  if (user.verificationCode === null)
    return res
      .status(401)
      .json({ success: false, msg: 'Please enter a verification code' });

  // see if date is past verification expiry
  if (Date.now() > user.verificationExpire) {
    user.verificationCode = null;
    user.verificationExpire = null;
    await user.save();
    res.status(401).json({ success: false, msg: 'Code expired' });

    // if verification code matches
  } else if (await user.matchVerificationCode(verificationCode)) {
    user.password = newPassword;
    user.verificationCode = null;
    user.verificationExpire = null;
    await user.save();
    res.status(200).json({ success: true, data: user, msg: 'Password reset' });
  } else {
    res.status(401).json({ success: false, msg: 'Invalid code' });
  }
};

const login = async (req, res, next) => {
  // store email and password from request body
  const { emailAddress, password } = req.body;

  // check if email and password are validated
  if (!emailAddress || !password) {
    return res
      .status(400)
      .json({ success: false, msg: 'Please provide an email and password' });
  }

  // find user with entered email
  let user;
  try {
    user = await User.findOne({ emailAddress }).select('+password');
  } catch (e) {
    return res.status('400').json({ success: false, msg: e.message });
  }

  // reject request if user doesn't exist
  if (!user) {
    return res.status(401).json({ success: false, msg: 'Invalid credentials' });
  }

  // check if password matches
  const isMatch = await user.matchPassword(password);

  // if the password matches
  if (isMatch) {
    // if email isn't confirmed reroute to verify email
    if (user.emailConfirmed === false) {
      req.body = user;
      next();
    }
    // if email is confirmed send JWT
    else {
      const token = user.JWT();

      // return success and token
      res.status(200).json({ success: true, token, msg: 'Successful login' });
    }
  } else {
    res.status(401).json({ success: false, msg: 'Invalid credentials' });
  }
};

const isValidObjectId = (id) => {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
};

const isValidEmail = (email) => {
  if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) return true;
  else return false;
};

const isValidPassword = (password) => {
  if (password.length >= 6 && password.length <= 10) return true;
  else return false;
};

module.exports = {
  verifyEmail,
  register,
  confirmEmail,
  forgotPassword,
  resetPassword,
  login,
};
