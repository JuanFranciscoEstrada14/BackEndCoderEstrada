const passport = require('passport'); // Asegúrate de importar passport
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../dao/models/User'); // Asegúrate de importar User correctamente

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt']; // Aquí 'jwt' es el nombre de la cookie donde almacenamos el token
  }
  return token;
};

passport.use('jwt', new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // Usamos cookieExtractor para extraer el token
  secretOrKey: process.env.JWT_SECRET,
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