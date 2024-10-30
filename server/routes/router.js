const express = require('express');
const passport = require('passport');
const router = express.Router();
const discordController = require('../controllers/discordController');
const googleController = require('../controllers/googleController');
const facebookController = require('../controllers/facebookController');

// Discord Routes
router.get('/auth/discord', passport.authenticate('discord'));

router.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
    discordController.authCallback
);

// Google Routes
router.get('/auth/google', passport.authenticate('google'));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    googleController.googleAuthCallback
);

// Facebook Routes
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    facebookController.facebookAuthCallback
);

module.exports = router;
