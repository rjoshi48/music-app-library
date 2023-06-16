const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let reviewSchema = new Schema({
    desc: { type: String, required: true, max: 1500 },              // Description of review by the entity
    rating: { type: Number, required: true, max: 5 },               // Rating given by the entity to the song
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // UUID of the entity giving the review
    playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }, // Song id for which the review is given by the entity
}, { collection: 'reviews' });


// Export the model
module.exports = mongoose.model('Review', reviewSchema);