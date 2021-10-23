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
    if (req.url === '/register')
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
  const verificationCode = req.body.verificationCode;

  const user = await User.findById(req.params.id);

  if (Date.now() > user.verificationExpire) {
    user.verificationCode = null;
    user.verificationExpire = null;
    await user.save();
    res.status(401).json({ success: false, msg: 'Code Expired' });
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
  // // set variables from input fields
  // const { emailAddress } = req.body;
  // // find user with entered data
  // const user = await User.findOne({ emailAddress });
  // // set request body to new user
  // req.body = user;
  // // call next
  // next();
};

const confirmReset = async (req, res, next) => {
  // const verificationCode = req.body.verificationCode;
  // const user = await User.findById(req.params.id);
  // if (Date.now() > user.verificationExpire) {
  //   user.verificationCode = null;
  //   user.verificationExpire = null;
  //   await user.save();
  //   res.status(401).json({ success: false, msg: 'Code Expired' });
  // } else if (await user.matchVerificationCode(verificationCode)) {
  //   user.resetConfirmed = true;
  //   user.verificationCode = null;
  //   user.verificationExpire = null;
  //   await user.save();
  //   res.status(201).json({ success: true, data: user });
  // } else {
  //   res.status(401).json({ success: false, msg: 'Unauthorized' });
  // }
};

const resetPassword = async (req, res, next) => {
  // const newPassword = req.body.password;
  // const user = await User.findById(req.params.id);
  // if (user.resetConfirmed) {
  //   user.password = newPassword;
  //   user.resetConfirmed = true;
  //   await user.save();
  //   res.status(201).json({ success: true, data: user });
  // } else {
  //   res.status(401).json({ success: false, msg: 'Unauthorized' });
  // }
};

const login = async (req, res, next) => {
  // const { email, password } = req.body;
  // if (!email || !password) {
  //   res
  //     .status(400)
  //     .json({ success: false, msg: 'Please provide an email and password' });
  // }
  // const user = await User.findOne({ email }).select('+password');
  // if (!user) {
  //   res.status(401).json({ success: false, msg: 'Invalid Credentials' });
  // }
  // const isMatch = await user.matchPassword(password);
  // if (!isMatch) {
  //   res.status(401).json({ success: false, msg: 'Invalid Credentials' });
  // } else {
  //   res.status(200).json({ success: true, data: user });
  // }
};

const logout = (req, res, next) => {};

module.exports = {
  verifyEmail,
  register,
  forgotPassword,
  confirmEmail,
  confirmReset,
  resetPassword,
  login,
  logout,
};
