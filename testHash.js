const bcrypt = require('bcrypt');

const testPassword = '123456';

(async () => {
    try {
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        console.log('Contraseña hasheada:', hashedPassword);

        // Comparar la contraseña
        const isMatch = await bcrypt.compare(testPassword, hashedPassword);
        console.log('¿Coincide la contraseña?', isMatch);

    } catch (error) {
        console.error('Error en la prueba de hash:', error);
    }
})();
