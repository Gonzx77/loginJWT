const User = require('../models/User');

exports.facebookAuthCallback = async (req, res) => {
    const profile = req.user;

    if (!profile || !profile.emails || !profile.emails[0] || !profile.displayName) {
        return res.send('Error: no se pudo obtener información del usuario.');
    }

    try {
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
            // Crear un nuevo usuario
            user = new User({
                facebookId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value || null,
                avatar: profile.photos[0] ? profile.photos[0].value : null,
                // No se asigna discordId ni googleId aquí
            });
            await user.save();
        } else {
            // Actualizar solo los campos relevantes
            user.username = profile.displayName;
            user.email = profile.emails[0].value || null;
            user.avatar = profile.photos[0] ? profile.photos[0].value : null;
            await user.save(); // Guardar los cambios
        }

        res.send(`Usuario registrado: ${user.username}`);
    } catch (error) {
        console.error(error);
        res.send(`Error: ${error.message}`);
    }
};

