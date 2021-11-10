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

const sendScoreEmail = async (
  emailAddress,
  firstName,
  product,
  lesson,
  attempts,
  score,
  highestScore,
  averageScore
) => {
  const mailgunData = {
    from: 'Neurologica VR <noreply@neurologicavr.com>',
    to: emailAddress,
    subject: 'Quiz Results',
    html: `<h1>Hello ${firstName}</h1>
      <h2>Latest quiz results for ${product}: lesson ${lesson}</h2>
			<p>Attempts: ${attempts} of 2</p><br>
			Latest Score: ${score}</p><br>
			Highest Score: ${highestScore}</p><br>
			Average Score: ${averageScore}</p>`,
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
