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

module.exports = router;
