const express = require('express');
var fs = require("fs");
var tracks = JSON.parse(fs.readFileSync("./data/" + "raw_tracks.json", 'utf8'));
const SongDB = require('../models/song.model');

// Create a new song based on data passed in the body
exports.add_new_song = function (req, res, next) {
    // Create song object
    let curr_song = new SongDB(
        {
            Title: req.body.Title,
            Artist: req.body.Artist,
            Album: req.body.Album,
            Track: req.body.Track,
            Year: req.body.Year,
            Length: req.body.Length,
            Genre: req.body.Genre,
            Reviews: [],
            Hidden: req.body.Hidden
        }
    );

    // Write the song to the db
    curr_song.write_to_db(function (error_msg, curr_song) {
        if (error_msg) {
            return next(error_msg);
        }
        if (req.body.desc != undefined) {
            review_controller.addReview(req, res, next, curr_song._id);
        }
        res.status(200).send(curr_song);
    }
    );
};

// Search song based on track name, album name, artist name and track genres
exports.search_matching_songs = function (req, resp){
    var input = req.params.search_key.toString();
    console.log(input);
    let i = 0;
    let musicinfo = [];
    tracks.forEach(element =>{
            if((element.track_title.toString().toLowerCase().includes(input.toString().toLowerCase())) 
            || (element.album_title.toString().toLowerCase().includes(input.toLowerCase())) || 
            (element.artist_name.toString().toLowerCase().includes(input.toLowerCase())) || 
            (element.track_genres.toString().toLowerCase().includes(input.toLowerCase())))
            {
                musicinfo[i] = {
                    "track_id": element.track_id,
                    "track_title": element.track_title,
                    "album_title": element.album_title,
                    "artist_name": element.artist_name,
                    "track_duration": element.track_duration,
                    "genere": element.track_genres
                }
                i++;
            }
        })

        // Check if song is found
        if(musicinfo.length<1){
            resp.status(404).send("Song not present in Database");
        }
        else{
            resp.send(musicinfo);
        }
};

// Retrieve the list of songs
exports.get_all_songs = function (req, res, next) {
        try {
            res.status(200).send(tracks);
        } catch (error_msg) {
            res.status(500).send('Error fetching matching track details!')
        }
};

// Return the sorted list of songs based on user reviews and rating
exports.get_sorted_songs_limit_n = function (req, res, next) {
    SongDB.find(
        {hidden:{$ne:false}}
        ).sort('-Rating').limit(10).populate({ 
            path: 'Reviews', 
            options: { sort: { _id: -1 }, limit: 2 },
            populate: { path: 'user_id' } 
            }).exec(function (error_msg, item) {
                if (error_msg) return next(error_msg);
                res.send(item);
            });
};

// Retrieve the list of songs by id
exports.get_songs_by_id = function (req, res, next) {
    SongDB.findById(req.params.id).populate(
            { 
                path: 'Reviews', 
                options: { sort: { _id: -1 }, limit: 2 }, 
                populate: { path: 'user_id' } }
            ).exec(function (error_msg, item) {
                if (error_msg) return next(error_msg);
                 res.send(item);
            });
};

// Detail the list of songs by id
exports.song_delete_by_id = function (req, res, next) {
    SongDB.findByIdAndDelete(req.body.id, function (error_msg, curr_song) {
        if (error_msg) return next(error_msg);
        res.send(curr_song);
    });

};

// Detail the song by id
exports.delete_entire_song_info = function (req, res, next) {  
    SongDB.findByIdAndDelete(req.params.id, function (error_msg, curr_song) {
        if (error_msg) return next(error_msg);
        
        review_controller.deleteReviews(req, res, next, req.params.id);
        res.status(200).send({msg:'Entire current song info cleared from database'});
    });

};

// Modify the list of songs by id
exports.modify_current_song = function (req, res, next) {
    SongDB.findById(req.body._id, function (error_msg, curr_song) {
        if (error_msg) { 
            return next(error_msg); 
        }
        if (req.body.Genre != undefined) { 
            console.log("Genre is set");
            curr_song.Genre = req.body.Genre;
        }
        if (req.body.Hidden != undefined) { 
            console.log("Song is set");
            curr_song.Hidden = req.body.Hidden; 
        }
        if (req.body.Year != undefined) { 
            console.log("Year of Song is set");
            curr_song.Year = req.body.Year; 
        }
        if (req.body.Length != undefined) { 
            console.log("Length of Song is set");
            curr_song.Length = req.body.Length; 
        }
        if (req.body.Album != undefined) { 
            console.log("Album of Song is set");
            curr_song.Album = req.body.Album; 
        }
        if (req.body.Track != undefined) { 
            console.log("Track of song is set");
            curr_song.Track = req.body.Track; 
        }

        if (req.body.Title != undefined) { 
            console.log("Title of song is set");
            curr_song.Title = req.body.Title; 
        }
        if (req.body.Artist != undefined) { 
            console.log("Artist of song is set");
            curr_song.Artist = req.body.Artist; 
        }

        curr_song.save(function (error_msg, curr_song) {
            if (error_msg) {
                console.log("Error in saving of song");
                return next(error_msg);
            }
            console.log("Saving of song complete");
            res.status(200).send(curr_song);
        }
        );
    });
};