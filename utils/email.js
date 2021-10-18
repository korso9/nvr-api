const mailgun = require('../config/email');

const verifyEmail = async (emailAddress, firstName, code) => {
  const mailgunData = {
    from: 'Neurologica VR <noreply@neurologicavr.com>',
    to: emailAddress,
    subject: 'Your email verification code',
    html: '<h1> Verification Email </h1>'
  };

  try {
    const response = await mailgun.messages.create(process.env.DOMAIN_NAME, mailgunData);
  } catch (err) {
    console.log(err.message);
  }
};

const scoreEmail = async (emailAddress, firstName, score) => {
  const mailgunData = {
    from: 'Neurologica VR <noreply@neurologicavr.com>',
    to: emailAddress,
    subject: 'Quiz Results',
    html: '<h1> Score Email </h1>'
  };

  try {
    const response = await mailgun.messages.create(process.env.DOMAIN_NAME, mailgunData);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { verifyEmail, scoreEmail };