const nodemailer = require('nodemailer');
const env = require('../utils/setEnv');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL_USERNAME,
    pass: env.EMAIL_PASSWORD,
  },
  logger: true,
  debug: true,
});

module.exports.sendVerificationEmail = async (to, token) => {
  const verificationUrl = `http://localhost:${env.PORT}/api/v1/auth/verify-email/${token}`;

  const mailOptions = {
    from: 'no-reply@blog.com',
    to,
    subject: 'Verify your email address',
    html: `<p>Please click the following link to verify your email and to complete your registration</p>
               <a href="${verificationUrl}">Verify Email</a>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.response);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Could not send verification email');
  }
};
