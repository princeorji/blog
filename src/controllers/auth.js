const db = require('../config/database');
const argon = require('argon2');
const env = require('../utils/setEnv');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../service/mail');

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

module.exports = {
  signup,
  verifyEmail,
  login,
};
