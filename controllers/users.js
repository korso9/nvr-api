const { sendVerifyEmail } = require('../utils/email');
const User = require('../models/User');

const verifyEmail = async (req, res, next) => {
  // set success status code based on registration or password reset
  const successCode = req.url === '/register' ? 201 : 200;

  // Declare user variable
  let user;

  // If request for code resend
  if (req.url.includes('/resend')) {
    // find user by request parameter id
    user = await User.findById(req.params.id);
    // if no user is found
    if (!user) {
      res.status(400).json({
        success: false,
        msg: `No user found with id: ${req.params.id}`,
      });
    }
    // if verification code is null, verification was never initialized
    if (user.verificationCode === null) {
      res
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

  // create new user with entered data
  const user = await User.create({
    emailAddress,
    firstName,
    lastName,
    password,
  });

  // set request body to new user
  req.body = user;

  // call next
  next();
};

const confirmEmail = async (req, res, next) => {
  // store verification code from request body
  const { verificationCode } = req.body;

  // find user by passed in user id
  const user = await User.findById(req.params.id);

  // if no user is found
  if (!user) {
    res
      .status(400)
      .json({ success: false, msg: `No user found with id: ${req.params.id}` });
  }

  // If no verification code stored, return unauthorized
  if (user.verificationCode === null)
    res
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
  const user = await User.findOne({ emailAddress });

  // set request body to new user
  req.body = user;

  // call next
  next();
};

const resetPassword = async (req, res, next) => {
  // store verification code and new password from request body
  const { verificationCode, newPassword } = req.body;

  // find user by passed in user id
  const user = await User.findById(req.params.id);

  // if no user is found
  if (!user) {
    res
      .status(400)
      .json({ success: false, msg: `No user found with id: ${req.params.id}` });
  }

  // If no verification code stored, return unauthorized
  if (user.verificationCode === null)
    res
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
    res
      .status(400)
      .json({ success: false, msg: 'Please provide an email and password' });
  }

  // find user with entered email
  let user = await User.findOne({ emailAddress }).select('+password');

  // reject request if user doesn't exist
  if (!user) {
    res.status(401).json({ success: false, msg: 'Invalid credentials' });
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

module.exports = {
  verifyEmail,
  register,
  confirmEmail,
  forgotPassword,
  resetPassword,
  login,
};
