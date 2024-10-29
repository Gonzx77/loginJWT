const express = require('express');
const passport = require('passport');
const router = express.Router();
const discordController = require('../controllers/discordController');

// Iniciar autenticación con Discord
router.get('/auth/discord', passport.authenticate('discord'));

// Callback de Discord
router.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
    discordController.authCallback
);

router.get('/auth/facebook', passport.authenticate('facebook'));

// Callback de Discord
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    discordController.authCallback
);

router.get('/auth/google', passport.authenticate('google'));

// Callback de Discord
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    discordController.authCallback
);

module.exports = router;
