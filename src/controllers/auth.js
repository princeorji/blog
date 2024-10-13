const db = require('../config/database');
const argon = require('argon2');
const env = require('../utils/setEnv');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const crypto = require('crypto');
const {
  sendVerificationEmail,
  forgotpasswordEmail,
} = require('../service/mail');

const User = db.users;

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const verification_token = crypto.randomBytes(32).toString('hex');

    const hashedPassword = await argon.hash(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verification_token,
    });

    await sendVerificationEmail(user.email, verification_token);
    res.status(201).json({
      message:
        'Signup successful! Please check your email to verify your account.',
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ where: { verification_token: token } });
    if (!user) {
      return res
        .status(400)
        .json({ error: 'Invalid or expired verification token' });
    }

    user.is_verified = true;
    user.verification_token = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ error: 'Email not verified' });
    }

    const isMatch = await argon.verify(user.password, password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // generate access token
    const accessToken = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    user.reset_token = token;
    user.reset_token_expires = Date.now() + 3600000; // 1 hour
    await user.save();

    await forgotpasswordEmail(user.email, token);
    res.status(200).json({ message: 'Password reset token sent to email.' });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { reset_token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        reset_token,
        reset_token_expires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const hashedPassword = await argon.hash(newPassword);

    // Update the user's password and reset token fields
    user.password = hashedPassword;
    user.reset_token = null;
    user.reset_token_expires = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
};
