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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Configura la estrategia de GitHub para Passport
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/api/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            return done(null, user);
        }

        const newUser = new User({
            email: profile.emails[0].value,
            password: '', // No se requiere contraseña para GitHub
            role: 'user'
        });
        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
}));

// Serializa el usuario para almacenar en sesión
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserializa el usuario desde la sesión
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
