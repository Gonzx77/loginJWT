const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');
require('dotenv').config();

const discordRoutes = require('./server/routes/discordRoutes');
const User = require('./server/models/User');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Configurar Passport
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

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Usar rutas
app.use('/', discordRoutes);

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
