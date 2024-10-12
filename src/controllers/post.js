const db = require('../config/database');
const { calculateReadTime } = require('../utils/readTime');

const Post = db.posts;

const create = async (req, res, next) => {
  const { title, description, tags, state, body } = req.body;

  try {
    const post = await Post.create({
      title,
      description,
      tags,
      state,
      body,
      author: req.user.id,
      reading_time: calculateReadTime(body),
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const posts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const order_by = req.query.order_by || 'ASC';

  const offset = (page - 1) * limit;
  try {
    const posts = await Post.findAll({
      where: { state: 'published' },
      limit,
      offset,
      order: [
        ['read_count', order_by],
        ['createdAt', order_by],
      ],
    });

    res.status(200).json({ posts, page, limit });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.read_count += 1;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (updates.body) {
      updates.reading_time = calculateReadTime(updates.body);
    }

    await post.update(updates);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.destroy({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  posts,
  getById,
  update,
  remove,
};
