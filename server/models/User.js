const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
    accessToken: { type: String }, // Campo para almacenar el token de sesión
    // Puedes agregar un campo específico para el sessionToken si lo deseas
});

const User = mongoose.model('User', userSchema);
module.exports = User;
