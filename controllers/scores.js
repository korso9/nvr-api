const { sendScoreEmail } = require('../utils/email');
const Score = require('../models/Score');

const validScoreParameters = (product, lesson) => {
  if (process.env.PRODUCT_LIST.includes(product) && !isNaN(lesson)) return true;
  else return false;
};

const postScore = async (req, res, next) => {
  // set variables from request
  const user = req.user;
  const { product, lesson, newScore } = req.body;

  // validate score
  if (isNaN(newScore) || newScore < 0 || newScore > 100)
    return res
      .status(400)
      .json({ success: false, msg: `${newScore} is not a valid score` });

  const latestScore = Math.round(newScore);

  // validate request parameters
  if (!validScoreParameters(product, lesson))
    return res
      .status(400)
      .json({ success: false, msg: 'Invalid product or lesson' });

  // find score
  let score = await Score.findOne({ product, lesson, user: user.id });

  // if no score exists, create one
  if (!score) {
    score = await Score.create({
      product,
      lesson,
      score1: latestScore,
      user: user.id,
    });
    await sendScoreEmail(
      user.emailAddress,
      user.firstName,
      score.product,
      score.lesson,
      score.attempts,
      latestScore,
      score.highestScore,
      score.averageScore
    );
    res.status(201).json({ success: true, msg: 'New score created' });
  } else {
    if (score.attempts === 2)
      res.status(400).json({ success: false, msg: '2 attempts already taken' });
    else {
      score.score2 = latestScore;
      await score.save();
      await sendScoreEmail(
        user.emailAddress,
        user.firstName,
        score.product,
        score.lesson,
        score.attempts,
        latestScore,
        score.highestScore,
        score.averageScore
      );
      res.status(200).json({ success: true, msg: 'Existing score updated' });
    }
  }
};

const getScore = async (req, res, next) => {
  // set variables from request
  const user = req.user;
  const product = req.params.product;
  const lesson = req.params.lesson;

  // validate request parameters
  if (!validScoreParameters(product, lesson))
    return res
      .status(400)
      .json({ success: false, msg: 'Invalid product or lesson' });

  // find score
  const score = await Score.findOne({ product, lesson, user: user.id });

  // if no score exists return 400
  if (!score)
    return res.status(400).json({
      success: false,
      msg: `No score saved for user ${user.emailAddress}`,
    });

  // return score
  res.status(200).json({ success: true, data: score });
};

module.exports = {
  postScore,
  getScore,
};
