const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: String,
  description: String,
  tags: Array,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  timestamp: Date,
  state: String,
  read_count: { type: Number, default: 0 },
  reading_time: Number,
  body: String,
});

schema.index({ title: 'text', tags: 'text' });

module.exports = mongoose.model('Posts', schema);
