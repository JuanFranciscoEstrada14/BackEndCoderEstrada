module.exports = {
    transport: {
      service: 'Gmail', // o el servicio de correo que elijas
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    },
    from: 'your-email@example.com' // Cambia esto a tu dirección de correo
  };
  