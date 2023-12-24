const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
const opts = {}

const Users = require('../models/users')
require('dotenv').config()

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.jwt_secret

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const user = await Users.findOne({ id: jwt_payload.id }).exec()

        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
            // or you could create a new account
        }
    } catch (err) {
        return done(err, false)
    }
}))




