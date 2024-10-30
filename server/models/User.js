const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: { type: String, unique: true },
    googleId: { type: String, unique: true },
    facebookId: { type: String, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
    accessToken: { type: String },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
