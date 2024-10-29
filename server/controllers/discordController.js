const User = require('../models/User');

exports.authCallback = async (req, res) => {
    try {
        const profile = req.user;

        // Obtén el token de la cookie
        const sessionToken = req.sessionID; // Esto es el valor de 'connect.sid'

        // Busca o crea un usuario en la base de datos
        const user = await User.findOneAndUpdate(
            { discordId: profile.id },
            {
                username: profile.username,
                email: profile.email,
                avatar: profile.avatar,
                accessToken: sessionToken, // Almacena el token aquí
            },
            { upsert: true, new: true }
        );

        // Redirigir a la ruta /secretstuff después de autenticarse
        res.redirect('/secretstuff');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al autenticar');
    }
};
