const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    jwt_token: { type: String, required: true },
    token_details: { type: Date, required: true, default: Date.now, expires: 120 }
});

module.exports = mongoose.model('Token', tokenSchema);