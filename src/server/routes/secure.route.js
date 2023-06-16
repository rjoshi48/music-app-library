//Contains all the routes for authenticated and authorized user entity

const express = require('express');
const router = express.Router();

const playlist_controller = require('../controllers/playlist.controller');
const review_controller = require('../controllers/review.controller');
const song_controller = require('../controllers/song.controller');

router.post('/song', song_controller.song_create);
router.post('/userReviews', review_controller.review); //Add review fucntionality

// Route to fetch playlist of validated user
router.get('/customPlaylist/userval/id', playlist_controller.validatedUserPlaylist); 

// Get  details of the selected playlist by id
router.get('/playlist/:id', playlist_controller.playlistDetailsById); 

// Search functionality route
router.get('/playlist/search/:searchParam', playlist_controller.searchPlaylist); 

// Route to handle playlist creation
router.post('/customPlaylist', playlist_controller.CustomListAdd); 

// Route to handle playlist modification
router.put('/customPlaylist', playlist_controller.modification);

// Route to handle deleteion of playlist
router.delete('/customPlaylist', playlist_controller.deletion); 
module.exports = router;
