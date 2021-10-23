const mailgun = require('../config/email');

const sendVerifyEmail = async (emailAddress, firstName, code) => {
  const mailgunData = {
    from: 'Neurologica VR <noreply@neurologicavr.com>',
    to: emailAddress,
    subject: 'Your email verification code',
    html: `<h1>Hello ${firstName}</h1>
      <h2>Your verification code is: ${code}</h2>`,
  };

  try {
    console.log(`verification email sent to: ${emailAddress}`);
    const response = await mailgun.messages.create(
      process.env.DOMAIN_NAME,
      mailgunData
    );
  } catch (err) {
    console.log(err.message);
  }
};

const sendScoreEmail = async (emailAddress, firstName, score) => {
  const mailgunData = {
    from: 'Neurologica VR <noreply@neurologicavr.com>',
    to: emailAddress,
    subject: 'Quiz Results',
    html: '<h1> Score Email </h1>',
  };

  try {
    console.log(`score email sent to: ${emailAddress}`);
    const response = await mailgun.messages.create(
      process.env.DOMAIN_NAME,
      mailgunData
    );
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { sendVerifyEmail, sendScoreEmail };
