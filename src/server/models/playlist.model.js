const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Schema for user created playlist

let playlistSchema = new Schema({
    playlist_title: { type: String, required: true, max: 300 },                 // Title of user created playlist
    playlist_desc: { type: String, max: 300 },                                  // Description of user created playlist
    user_id: { type: Number, required: true },             // UUID of user created playlist
    songs: [{
        id: Number,
        track: String,
        duration: String,
        artist: String,
        album: String
    }],                    // Description of songs in the user created playlist
    visiblity: { type: String, required: true, max: 300, default: 'private' },  // Is user created playlist visible to all?
}, { collection: 'playlist' });

playlistSchema.index(
    { playlist_title: 'text', playlist_desc: 'text' }, 
    {   name: 'Playlist Index', weights: 
        {
            playlist_title: 10, playlist_desc: 4
        }
    });

// Export the model
module.exports = mongoose.model('Playlist', playlistSchema);