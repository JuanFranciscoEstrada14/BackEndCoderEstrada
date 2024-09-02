const bcrypt = require('bcrypt');

const testPassword = '123456';

(async () => {
    try {
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        console.log('Contraseña hasheada:', hashedPassword);

        const isMatch = await bcrypt.compare(testPassword, hashedPassword);
        console.log('¿Coincide la contraseña?', isMatch);

    } catch (error) {
        console.error('Error en la prueba de hash:', error);
    }
})();
