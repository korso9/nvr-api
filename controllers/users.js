const { sendVerifyEmail } = require('../utils/email');
const User = require('../models/User');

const verifyEmail = async (req, res, next) => {
  // set success status code based on registration or password reset
  const successCode = req.originalUrl === '/register' ? 201 : 200;

  // set user sent from request body
  const user = req.body;

  // generate email verification code
  const verificationCode = await user.getVerificationCode();

  // save updated user information in database
  user.save({ validateBeforeSave: false });

  // send email with verification code
  await sendVerifyEmail(user.emailAddress, user.firstName, verificationCode);

  // if user is accessing via unity
  if (req.header('user-agent') === 'unity') {
    // return success status code and user data
    res.status(successCode).json({ success: true, data: user });
    // else return status code and redirect to email confirmation
  } else {
    if (req.url === '/register' || req.url === '/login')
      res.redirect(successCode, `/confirm/${user.id}`);
    else if (req.url === '/forgot')
      res.redirect(successCode, `/reset/${user.id}`);
    else res.status(500).json({ success: false, msg: 'Server Error' });
  }
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

  // If no verification code stored, return unauthorized
  if (user.verificationCode === null)
    res.status(401).json({ success: false, msg: 'Unauthorized' });

  // see if date is past verification expiry
  if (Date.now() > user.verificationExpire) {
    user.verificationCode = null;
    user.verificationExpire = null;
    await user.save();
    res.status(401).json({ success: false, msg: 'Code Expired' });

    // if verification code matches
  } else if (await user.matchVerificationCode(verificationCode)) {
    user.emailConfirmed = true;
    user.verificationCode = null;
    user.verificationExpire = null;
    await user.save();
    res.status(201).json({ success: true, data: user });
  } else {
    res.status(401).json({ success: false, msg: 'Unauthorized' });
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

  // If no verification code stored, return unauthorized
  if (user.verificationCode === null)
    res.status(401).json({ success: false, msg: 'Unauthorized' });

  // see if date is past verification expiry
  if (Date.now() > user.verificationExpire) {
    user.verificationCode = null;
    user.verificationExpire = null;
    await user.save();
    res.status(401).json({ success: false, msg: 'Code Expired' });

    // if verification code matches
  } else if (await user.matchVerificationCode(verificationCode)) {
    user.password = newPassword;
    user.verificationCode = null;
    user.verificationExpire = null;
    await user.save();
    res.status(201).json({ success: true, data: user });
  } else {
    res.status(401).json({ success: false, msg: 'Unauthorized' });
  }
};

const login = async (req, res, next) => {
  // store email and password from request body
  const { email, password } = req.body;

  // check if email and password are validated
  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, msg: 'Please provide an email and password' });
  }

  // find user with entered email
  const user = await User.findOne({ email }).select('+password');

  // reject request if user doesn't exist
  if (!user) {
    res.status(401).json({ success: false, msg: 'Invalid Credentials' });
  }

  // check if password matches
  const isMatch = await user.matchPassword(password);
  // if the password matches
  if (isMatch) {
    // if email isn't confirmed reroute to verify email
    if (user.emailConfirmed === false) next();
    // if email is confirmed send JWT
    else {
      const token = user.JWT();
      // if accessing from browser store token in cookies
      if (req.header('user-agent') !== 'unity') {
        res.cookie('token', token, {
          expires:
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: true,
        });
      }
      // return success and token
      res.status(200).json({ success: true, token });
    }
  } else {
    res.status(401).json({ success: false, msg: 'Invalid Credentials' });
  }
};

const logout = (req, res, next) => {
  // force expire token
  res.cookie('token', 'none', {
    expires: Date.now() + 10 * 1000,
    httpOnly: true,
  });

  // send success response
  res.status(200).json({
    success: true,
    data: {},
  });
};

module.exports = {
  verifyEmail,
  register,
  confirmEmail,
  forgotPassword,
  resetPassword,
  login,
  logout,
};
