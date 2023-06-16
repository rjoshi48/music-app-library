const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let songSchema = new Schema({
    SongTitle: { type: String, required: true, max: 300 },              // Title name of song
    Artistname: { type: String, required: true, max: 300 },             // Artist name of song
    AlbumName: { type: String, required: true, max: 300 },              // Album name of song
    TrackName: { type: Number, required: true, max: 999 },
    YearOfAlbum: { type: Number, required: true, max: 2021 },              // Year of song released
    TrackLength: { type: Number, required: true, max: 2000 },            // Play duration of song
    GenreName: { type: String, required: true, max: 300 },              // Genre name of song
    ReviewsGiven: [{ type: Schema.Types.ObjectId, ref: 'Review' }],      // Revies given to song; Object of review type
    Rating: { type: Number, max: 5 },                               // Cummalative rating of song
    isHidden: { type: Boolean, required: true, default: false },    // Is the song visible to user?
    reviewCount: { type: Number }                                 // Number of reviews given to the song released
}, { collection: 'songs' });

songSchema.index(
    {
        SongTitle: 'text',
        ArtistName: 'text',
        AlbumName: 'text',
        GenreName: 'text'
    },
    {
        name: 'Song Index',
        weights:
        {
            Title: 15,
            Artist: 5,
            Album: 4,
            Genre: 2
        }
    });

// Exporting the model for use in another modules
module.exports = mongoose.model('Song', songSchema);