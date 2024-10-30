const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const DiscordStrategy = require('passport-discord').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const path = require('path');
const { join } = require('path');
require('dotenv').config();

const router = require('./server/routes/router');
const User = require('./server/models/User');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/css', express.static(join(__dirname, 'public/css')))
app.use('/js', express.static(join(__dirname, 'public/js')))
app.use('/storage', express.static(join(__dirname, 'public/storage')))

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));


passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/discord/callback',
    scope: ['identify', 'email']
},
    (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }
));
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    scope: ['profile', 'email'] // Asegúrate de agregar esto
},
(accessToken, refreshToken, profile, done) => {
    // Create or find user logic here
    User.findOneAndUpdate(
        { googleId: profile.id },
        {
            username: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile._json.picture,
            accessToken: refreshToken,
        },
        { upsert: true, new: true }
    ).then(user => {
        return done(null, user);
    }).catch(err => {
        return done(err);
    });
}


));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'photos']
},
(accessToken, refreshToken, profile, done) => {
    console.log('Facebook profile:', profile); // Agregar este log para depuración

    // Verifica que los campos existen antes de acceder a ellos
    const email = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null;
    const avatar = (profile.photos && profile.photos.length > 0) ? profile.photos[0].value : null;

    User.findOneAndUpdate(
        { facebookId: profile.id },
        {
            username: profile.displayName,
            email: email,
            avatar: avatar,
            accessToken: refreshToken,
        },
        { upsert: true, new: true }
    ).then(user => {
        return done(null, user);
    }).catch(err => {
        return done(err);
    });
}));





passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Usar rutas
app.use('/', router);

// Servir el archivo HTML desde la raíz
// Servir el archivo HTML desde la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html')); // Ajustado para la ruta correcta
});


// Ruta para la sección secreta
app.get('/secretstuff', (req, res) => {
    if (req.isAuthenticated()) {
        const userData = req.user; // Información del usuario autenticado
        // Guarda userData en MongoDB
        saveUserDataToMongo(userData); // Función que crearás para guardar en MongoDB
        res.send(`Bienvenido a la sección secreta, ${userData.username}`);
    } else {
        res.redirect('/');
    }
});

// Función para guardar datos del usuario en MongoDB
async function saveUserDataToMongo(userData) {
    try {
        await User.findOneAndUpdate(
            { discordId: userData.id },
            {
                username: userData.username,
                email: userData.email,
                avatar: userData.avatar,
            },
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error('Error al guardar el usuario en MongoDB:', error);
    }
}

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
