const logger = require('../../config/logger');
const Users = require('../models/users');
const Posts = require('../models/posts');

const userProfile = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await Users.findById(id).select('-password');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const posts = await Posts.find({ author: user._id });

    res.status(200).json({ user, posts });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  userProfile,
};
