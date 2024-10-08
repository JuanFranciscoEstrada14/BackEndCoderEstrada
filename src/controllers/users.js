const User = require('../dao/models/User');
const nodemailer = require('nodemailer'); 


const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const UserController = {
    getAllUsersForAdmin: async (req, res) => {
        try {
            const users = await User.find({}, 'first_name last_name email role');
            res.render('admin', { users });
        } catch (error) {
            res.status(500).send('Error al obtener los usuarios');
        }
    },

    getUserForEdit: async (req, res) => {
        try {
            const userId = req.params.uid;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.render('userEdit', { user });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el usuario' });
        }
    },

    updateUserRole: async (req, res) => {
        const { role } = req.body;
        try {
            const validRoles = ['user', 'premium', 'admin'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: 'Rol no válido' });
            }
            await User.findByIdAndUpdate(req.params.uid, { role });
            res.redirect('/admin/users');
        } catch (error) {
            res.status(500).send('Error al actualizar el rol del usuario');
        }
    },

    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.uid);
            res.redirect('/admin/users');
        } catch (error) {
            res.status(500).send('Error al eliminar el usuario');
        }
    },

    deleteInactiveUsers: async (req, res) => {
        try {
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

                        const inactiveUsers = await User.find({ last_connection: { $lt: twoDaysAgo } });

            for (const user of inactiveUsers) {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: 'Cuenta eliminada por inactividad',
                    text: 'Tu cuenta ha sido eliminada debido a inactividad prolongada.'
                });
                await User.findByIdAndDelete(user._id);
            }

            res.status(200).json({ message: 'Usuarios inactivos eliminados' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar usuarios inactivos', error });
        }
    },

    uploadDocuments: async (req, res) => {
        try {
            const userId = req.params.uid;
            const files = req.files;

            if (!files.length) {
                return res.status(400).json({ message: 'No se han subido archivos' });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const documents = files.map(file => ({
                name: file.originalname,
                reference: file.path
            }));
            user.documents = user.documents.concat(documents);

            await user.save();
            res.status(200).json({ message: 'Documentos subidos con éxito', user });
        } catch (error) {
            res.status(500).json({ message: 'Error al subir documentos', error });
        }
    },

    promoteToPremium: async (req, res) => {
        try {
            const userId = req.params.uid;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const requiredDocuments = [
                'Identificación',
                'Comprobante de domicilio',
                'Comprobante de estado de cuenta'
            ];

            const userDocuments = user.documents.map(doc => doc.name);
            const hasAllDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));

            if (!hasAllDocuments) {
                return res.status(400).json({ message: 'El usuario no ha cargado todos los documentos requeridos' });
            }

            user.role = 'premium';
            await user.save();

            res.status(200).json({ message: 'Usuario actualizado a premium con éxito', user });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el usuario a premium', error });
        }
    }
};

module.exports = UserController;
