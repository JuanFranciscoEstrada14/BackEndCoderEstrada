module.exports = {
    transport: {
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    },
    from: 'your-email@example.com'
  };
  