const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');

// Estrategia de Registro de Usuario
router.post('/register', async (req, res) => {
  const { email, password, role = 'user' } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Usuario ya existe' });
    }

    // Hashear la contraseña utilizando bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear un nuevo usuario
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ status: 'success', message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error en el registro' });
  }
});

// Estrategia de Login de Usuario
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.SECRET_KEY, {
        expiresIn: '1h'
      });
      res.cookie('jwt', token, { httpOnly: true, secure: true });
      return res.json({ message: 'Login successful', token });
    });
  })(req, res, next);
});

// Estrategia de Autenticación con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback de GitHub
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/products'); // Redirige a la vista de productos o a donde desees
  }
);

// Estrategia de Logout de Usuario
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Ruta para obtener el usuario actual utilizando JWT
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json({ status: 'success', user: req.user });
});

module.exports = router;