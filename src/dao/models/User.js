const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  documents: [{
    name: { type: String },
    reference: { type: String }
  }],
  last_connection: { type: Date }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// Middleware para actualizar last_connection en cada login o logout
userSchema.pre('save', function(next) {
  if (this.isModified('last_connection') || this.isNew) {
    this.last_connection = new Date();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
