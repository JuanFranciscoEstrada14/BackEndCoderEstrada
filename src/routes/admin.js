const express = require('express');
const router = express.Router();
const User = require('../dao/models/User'); 


function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Acceso denegado: Solo los administradores pueden acceder a esta ruta.');
}


router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, 'first_name last_name email role');
        res.render('adminUsers', { users });
    } catch (error) {
        res.status(500).send('Error al obtener los usuarios');
    }
});


router.post('/users/:id/delete', isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin/users');
    } catch (error) {
        res.status(500).send('Error al eliminar el usuario');
    }
});

router.post('/users/:id/role', isAdmin, async (req, res) => {
    const { role } = req.body;
    try {
        await User.findByIdAndUpdate(req.params.id, { role });
        res.redirect('/admin/users');
    } catch (error) {
        res.status(500).send('Error al actualizar el rol del usuario');
    }
});

module.exports = router;
