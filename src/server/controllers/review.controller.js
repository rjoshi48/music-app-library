//Contains the actual implementation of REST APIs related to 'review' functionality

const ReviewModel = require('../models/review.model');
const SongModel = require('../models/song.model');

exports.review = function (req, res, next) {
  
    createRevFunc(req, res, next, req.body.songId);
    SongModel.findById(req.body.song_id).populate({ path: 'Reviews', options: { sort: { _id: -1 }, limit: 2 }, populate: { path: 'user_id' } }).exec(function (err, item) {
        if (err) return next(err);
        res.status(200).send(item);    
    });
       

};

function createRevFunc(req, res, next, song) {
    let averageRating = 0;
    const reviewAdded = new ReviewModel(
        {

            about: req.body.description,
            ratingAdded: req.body.ratingAdded,
            userId: req.body.userId,
            songId: song
        }
    );
    reviewAdded.save(function (error, rev) {
        if (error) {
            return next(err);
        } else {
            SongModel.findById(song).populate({ path: 'Reviews' }).exec(function (err, song) {
                if (err) { return next(err); }
                else if (song.Reviews != undefined) {
                    let ratingCount = 0;
                    let k = 0;
                    if (rev.rating != undefined && rev.rating >= 1 && rev.rating <= 5) {
                        ratingCount = rev.rating;
                        k++;
                    }
                    song.rev.forEach(element => {
                        if (element.rating != undefined) {
                            ratingCount += element.rating;
                            k++;
                        }
                    });
                    if (ratingCount != 0 && k != 0) {
                        averageRating = ratingCount / k;
                    }
                    SongModel.findById(song, function (error, songFetched) {
                        if (error) return next(error);
                        songFetched.Reviews.push(review._id);
                        songFetched.Rating = Math.round(avgRating);
                        songFetched.reviewCount=k;
                        songFetched.save(function (err, songFetched) {
                            if (error) {
                                return next(error);
                            }
                            console.log('Review has been added to the track');
                        }
                        );
                    });
                }
            });
        }
    });
}

exports.createReview = async function (req, res, next) {
    console.log(req.body);
    await Playlist.findOne({ playlist_title: req.body.playlist_title.toLowerCase().trim() }).then(async playlist => {
        if (playlist) {

            const review = new Review(
                {
                    desc: req.body.desc,
                    rating: req.body.rating,
                    user_id: req.body.user_id,
                    playlist_id: req.body.playlist_id
                }
            );
            try {
                const savedReview = await Review.save(review);
                res.status(200).json(`Review has been created for playlist name: ${playlist.playlist_title}`);
            }
            catch (err) {
                res.status(400).json({ message: err.message });
            }
        } else {
            res.status(403).json("Custom Playlist does not exist in database")
        }
    })
        .catch(err => {
            res.status('Internal server error while checking if list exists!')
        })
};

exports.revAboutDetails = function (req, res, next) {
    Song.find(req.params.reviewId, function (error, element) {
        if (error) return next(error);
        res.send(element);
    });
};

exports.fetchAllReviews = function (req, res, next) {
    Review.find({ songId: req.params.songId }).populate({  path: 'userId' }).exec(function (error, element) {
        if (error) return next(error);
        res.send(element);
    });
};

exports.revDeletion = function (req, res, next) {
    Review.findByIdAndDelete(req.body.reviewId, function (err, reviewId) {
        if (error) return next(error);
        res.send('Deletion of review attached to playlist is achieved!');
    });
};

function allReviewsDeletion(req, res, next, track) {
    Review.deleteMany({ song_id: track }, function (error, rev) {
        if (error) {
            return next(error);
        } else {
            console.log('All revs has been deleted');
        }
    });
}

exports.reviewAddition = createRevFunc;
exports.reviewDeletion = revDeletion;    
exports.reviewAllDels = allReviewsDeletion;
