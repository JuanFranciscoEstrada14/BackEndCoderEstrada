const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../dao/models/User');
const UserDTO = require('../dto/UserDTO'); 
const PasswordResetToken = require('../dao/models/PasswordResetToken');
const { sendPasswordResetEmail } = require('../services/emailService');


exports.register = async (req, res) => {
  const { email, password, role = 'user' } = req.body;

  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Usuario ya existe' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ status: 'success', message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error en el registro' });
  }
};

exports.login = (req, res, next) => {
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
      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      res.cookie('jwt', token, { httpOnly: true, secure: true });
      return res.json({ message: 'Login successful', token });
    });
  })(req, res, next);
};


exports.github = passport.authenticate('github', { scope: ['user:email'] });


exports.githubCallback = (req, res) => {
  res.redirect('/products'); 
};


exports.logout = (req, res) => {
  req.logout();
  res.redirect('/login');
};


exports.current = (req, res) => {
  if (req.user) {
    const userDTO = new UserDTO(req.user);
    res.status(200).json({ status: 'success', user: userDTO });
  } else {
    res.status(401).json({ status: 'error', message: 'No estás autenticado' });
  }
};


exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.RESET_TOKEN_SECRET, { expiresIn: '1h' });

  await PasswordResetToken.create({
    userId: user._id,
    token,
    expiresAt: new Date(Date.now() + 3600000) 
  });

  await sendPasswordResetEmail(email, token);

  res.status(200).json({ status: 'success', message: 'Correo de restablecimiento enviado' });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const resetToken = await PasswordResetToken.findOne({ token });

  if (!resetToken || resetToken.expiresAt < Date.now()) {
    return res.status(400).json({ status: 'error', message: 'Token inválido o expirado' });
  }

  const user = await User.findById(resetToken.userId);

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
  }

  if (await bcrypt.compare(newPassword, user.password)) {
    return res.status(400).json({ status: 'error', message: 'La nueva contraseña no puede ser la misma que la actual' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  await PasswordResetToken.deleteMany({ userId: user._id }); 

  res.status(200).json({ status: 'success', message: 'Contraseña restablecida exitosamente' });
};
