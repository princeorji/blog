const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  post_count: { type: Number, default: 0 },
});

schema.pre('save', async function (next) {
  const user = this;
  try {
    const hash = bcrypt.hash(user.password, 10);

    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

schema.methods.isValidPassword = async function (password) {
  const user = this;
  try {
    return await bcrypt.compare(password, user.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

module.exports = mongoose.model('Users', schema);
