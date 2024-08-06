const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/users');

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // Allow passing the entire request to the callback
    },
    async (req, email, password, done) => {
      try {
        const { first_name, last_name } = req.body;

        // Check if the user with the given email already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
          return done(null, false, { message: 'Email already taken' });
        }

        // Create a new user with the provided information
        const newUser = await Users.create({
          email,
          password,
          first_name,
          last_name,
        });

        return done(null, newUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await Users.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);
