const express = require('express');
const router = express.Router();

const controller_playlist = require('../controllers/playlist.controller');
const controller_song = require('../controllers/song.controller');
const controller_user = require('../controllers/user.controller');
const controller_review = require('../controllers/review.controller');

// All the GET routes for Unauthorized entity

router.get('/user/verify/:token', controller_user.user_auth);                   // Authenticate the user
router.get('/song/top_n', controller_song.get_sorted_songs_limit_n);            // Retrieve the all song info ordered by user review and rating
router.get('/song/:id', controller_song.get_songs_by_id);                       // Retrieve the all song info by id
router.get('/review/:song_id', review_controller.all_reviews);                  // Retrieve the all reviews for the playlists
router.get('/song/search/:search_key', controller_song.search_matching_songs);  // Retrieve the all songs in the song database matching the search key
router.get('/song/all', controller_song.get_all_songs);                         // Retrieve the all songs in the song database
router.get('/get_privacypolicy',user_controller.privacy_policy)                 // Retrieve the privacy policy

// All the POST routes for Unauthorized entity
router.post('/user/authenticate', controller_user.user_auth);                   // Authorize a user to the music app
router.post('/user/authenticate/google', controller_user.user_google_auth);     // Authorize a user to the music app using 3rd party
router.post('/user/authenticate/reverify', controller_user.verify_again);       // API to re-verify the user
router.post('/user/signup', controller_user.create_new_user);                   // Add a new user to the user database
router.post('/edit_privacypolicy', user_controller.edit_privacy_policy);        // Update privacy policy

//router.post('/user/signup', controller_user.create_new_user);                   // Add a new user to the user database

// ROUTES for privacy policy




module.exports = router;