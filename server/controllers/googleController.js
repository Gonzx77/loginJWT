const User = require('../models/User');

exports.googleAuthCallback = async (req, res) => {
    const profile = req.user;

    if (!profile || !profile.email || !profile.username) {
        return res.send('Error: no se pudo obtener información del usuario.');
    }

    try {
        let user = await User.findOne({ googleId: profile.googleId });

        if (!user) {
            user = new User({
                googleId: profile.googleId,
                username: profile.username,
                email: profile.email,
                avatar: profile.avatar,
            });
            await user.save();
        }

        res.send(`Usuario ya registrado: ${user.username}`);
    } catch (error) {
        console.error(error);
        res.send(`Error: ${error.message}`);
    }
};

