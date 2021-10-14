const mailgun = require('../config/email');

const verifyEmail = async (emailAddress, firstName, code) => {
  const mailgunData = {
    from: 'noreply@neurologicavr.com',
    to: emailAddress,
    subject: 'Your email verification code',
    template: 'verify-email-template',
    'h:X-Mailgun-Variables': JSON.stringify({
      firstName,
      code,
    })
  };

  try {
    const response = await mailgun.messages.create(DOMAIN_NAME, mailgunData);
  } catch (err) {
    console.log(err);
  }
};

const scoreEmail = async (emailAddress, firstName, score) => {
  const mailgunData = {
    from: 'noreply@neurologicavr.com',
    to: emailAddress,
    subject: 'Quiz Results',
    template: 'verify-email-template',
    'h:X-Mailgun-Variables': JSON.stringify({
      firstName,
      code,
      score,
    })
  };

  try {
    const response = await mailgun.messages.create(DOMAIN_NAME, mailgunData);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { verifyEmail, scoreEmail };