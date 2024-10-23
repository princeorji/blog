const db = require('../config/database');

const User = db.users;

const profile = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: {
        exclude: [
          'password',
          'is_verified',
          'verification_token',
          'reset_token',
          'reset_token_expires',
          'createdAt',
          'updatedAt',
        ],
      },
    });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { profile };
