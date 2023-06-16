//Contains all the routes for admin entity
const express = require('express');
const router = express.Router();

const controller_playlist = require('../controllers/playlist.controller');
const controller_user = require('../controllers/user.controller');
const controller_song = require('../controllers/song.controller');
const controller_review = require('../controllers/review.controller');


// All the GET routes for ADMIN entity
router.get('/song', controller_song.get_all_songs);         // Retrieve the all songs in the song database
router.get('/playlist', controller_playlist.get_playlist);  // Retrieve thegit statu current user's playlist
router.get('/playlist/:playlist_id', controller_playlist.get_playlist_details); // Retrieve the current playlist info

// All the POST routes for ADMIN entity
router.post('/song', controller_song.add_new_song);         // Update the new song to the song database
router.post('/user', controller_user.create_new_user);      // Update the new user to the user database
router.post('/playlist', controller_playlist.playlist_new_create); // Update new playlist to playlist database

// All the PUT routes for ADMIN entity
router.put('/user', controller_user.user_modification);       // Modify user for roles and activation process
router.put('/song', controller_song.modify_current_song);     // Modify current song based on passed song parameters in song database
router.put('/playlist', controller_playlist.current_playlist_modify); // Modify current playlist based on passed playlist parameters in song database

// All the DELETE routes for ADMIN entity
router.delete('/playlist', controller_playlist.delete_playlist);        // Remove current from playlist database
router.delete('/song/:id', controller_song.delete_entire_song_info);    // Remove current song from song database
router.delete('/review', controller_review.delete_review);              // Remove review from review database


module.exports = router;