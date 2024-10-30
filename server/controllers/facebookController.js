const User = require('../models/User');

exports.facebookAuthCallback = async (req, res) => {
    const profile = req.user;

    if (!profile || !profile.emails || !profile.displayName) {
        return res.send('Error: no se pudo obtener información del usuario.');
    }

    try {
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
            user = new User({
                facebookId: profile.id, // Asegúrate de incluir esto
                username: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value, // Cambiado a photos
            });
            await user.save();
        }

        res.send(`Usuario ya registrado: ${user.username}`);
    } catch (error) {
        console.error(error);
        res.send(`Error: ${error.message}`);
    }
};
