const User = require('../models/User');

exports.facebookAuthCallback = async (req, res) => {
    try {
        const profile = req.user;

        const user = await User.findOneAndUpdate(
            { facebookId: profile.id },
            {
                username: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile._json.picture,
                accessToken: req.sessionID,
            },
            { upsert: true, new: true }
        );

        res.redirect('/secretstuff');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al autenticar con Facebook');
    }
};
