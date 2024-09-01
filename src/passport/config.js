const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../dao/models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Configura la estrategia local para Passport
passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'No existe el usuario' });
    }

    // Utilizamos la función comparePassword que agregamos en el archivo User.js
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Configura la estrategia de GitHub para Passport
passport.use('github', new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      const newUser = new User({
        email: profile.emails[0].value,
        role: 'user',
        githubId: profile.id
      });
      await newUser.save();
      return done(null, newUser);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Configura la estrategia de JWT para Passport
passport.use('jwt', new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: process.env.JWT_SECRET
}, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;