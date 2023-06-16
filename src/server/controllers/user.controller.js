express = require('express');

// Include modules
const Token = require('../models/token.model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User_db = require('../models/user.model');
const argon2 = require('argon2');

// Configure working directory
const secret = process.env.SECRET;
require('dotenv').config({ path: env_path });
const env_path = process.cwd() + '/config/env-config.env';


exports.create_new_user = function (req, res, next) {

    User_db.findOne({ email: req.body.email }, function (error_msg, curr_user) {
        if (error_msg) { return next(error_msg); }
        else {
            if (curr_user) {
                let error = 'User already exists. Please login-in or use a different email';
                return res.status(400).json({ type: 'reg-failed', msg: error });
            } else {
                // Hash the password and create a new user
                argon2.hash(req.body.password).then(hash => {
                    // Create a new user
                    const curr_user = new User_db(
                        {
                            username: req.body.username,
                            email: req.body.email,
                            password: hash
                        }
                    );

                    // Set up the server to send the email
                    curr_user.save(function (error_msg, curr_user) {
                        if (error_msg) {
                            return next(error_msg);
                        } else {

                            var transporter = nodemailer.createTransport({
                                host: "smtp-relay.sendinblue.com",
                                port: 587,
                                secure: false,
                                auth: {
                                    curr_user: process.env.SECRET_USERNAME,
                                    pass: process.env.SECRET_PASSWORD
                                }// Use the credentials from the environment
                            });

                            transporter.verify(function (error, success) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log("Email can be sent to the user to verify now");
                                }
                            });

                            // Create the JWT token
                            var token = new Token({ _userId: curr_user._id, token: require('crypto').randomBytes(16).toString('hex') });
                            // Token must be saved to verify
                            token.save(function (error_msg) {
                                if (error_msg) {
                                    return next(error_msg);
                                } else {
                                    // Send the email to the user
                                    var mailOptions = { from: 'noreply@musiclibrary-signup.com', to: curr_user.email, subject: 'Verify your email for music library', html: "<b>Hello </b></br><p>Follow this link to verify your email address. <a href='http://" + req.headers.host + "/api/open/user/verify/" + token.token + "'>Link to verify</a> </p>" };
                                    transporter.sendMail(mailOptions, function (error_msg) {
                                        if (error_msg) { return res.status(500).send({ msg: error_msg.message }); }
                                        console.log("Email has been sent to the user to verify now");
                                        res.status(200).send(curr_user);
                                    });
                                }
                            });
                        }
                    });
                });
            }
        }
    });
};


exports.verify_again = function (req, res, next) {

    User_db.findOne({ email: req.body.email }, function (error_msg, curr_user) {
        if (!curr_user) {
            return res.status(400).send({ msg: 'ERROR!! Database failed to fetch the user details!!' });
        }
        //Check if user is already verified. If yes, no need to re-verify
        if (curr_user.isVerified) {
            return res.status(400).send({ msg: 'User must log-in. Account is already verified' });
        }

        // Set up the server to send the email
        var transporter = nodemailer.createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            secure: false,
            auth: {
                curr_user: process.env.SECRET_USERNAME,
                pass: process.env.SECRET_PASSWORD
            }// Use the credentials from the environment
        });

        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email can be sent to the user to verify now");
            }
        });

        // Create the JWT token
        var token = new Token({ _userId: curr_user._id, token: require('crypto').randomBytes(16).toString('hex') });
        // Token must be saved to verify
        token.save(function (error_msg) {
            if (error_msg) {
                return next(error_msg);
            } else {
                var mailOptions = { from: 'noreply@musiclibrary-signup.com', to: curr_user.email, subject: 'Re-Verify your email for music library', html: "<b>Hello </b></br><p>Follow this link to verify your email address. <a href='http://" + req.headers.host + "/api/open/user/verify/" + token.token + "'>Link to re-verify</a> </p>" };
                transporter.sendMail(mailOptions, function (error_msg) {
                    if (error_msg) { return res.status(500).send({ msg: error_msg.message }); }
                    console.log("Email has been sent to the user to verify now");
                    res.status(200).send(curr_user);
                });
            }
        });

    });
};

exports.user_modification = function (req, res, next) {
    User.findById(req.body.user_id, function (error_msg, currUser) {
        if (error_msg) {
            return next(error_msg);
        } else {
            if (currUser != undefined) {
                if (req.body.role != undefined) { currUser.role = req.body.role; }
                if (req.body.active != undefined) { currUser.active = req.body.active; }


                currUser.save(function (error_msg, currUser) {
                    if (error_msg) {
                        return next(error_msg);
                    } else {
                        res.send('User modified successfully');
                    }
                });
            }
            else {
                res.send('User not found');
            }
        }
    });
};

exports.user_verify = function (req, res, next) {

    // Search for the given
    Token.findOne({ token: req.params.token }, function (error_msg, token) {
        if (error_msg) {
            return next(error_msg);
        } else {
            if (!token) return res.status(400).send({ type: 'not-verified', msg: 'Token invalid or expired.' });

            // Find the user for the given token
            User.findById(token._userId, function (error_msg, user) {
                if (error_msg) {
                    return next(error_msg);
                } else {
                    if (!user) return res.status(400).send({ msg: 'User not found for the given token. Please sign-up' });
                    if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'User is verified. Please login' });

                    // Set the verification flag and save the user in the database
                    user.isVerified = true;
                    user.save(function (error_msg) {
                        if (error_msg) { return res.status(500).send({ msg: error_msg.message }); }
                        res.status(200).send("Verification complete for the user. Proceed to log in.");
                    });
                }
            });
        }
    });
};

exports.user_creation = function (req, resp) {
    console.log("Inside Create User-----");
   console.log(req.body);

   User.findOne({ email: req.body.email }, function (error_msg, curr_user) {
    if (error_msg) { return next(error_msg); }
    else {
        if (curr_user) {
            let error = 'User already exists. Please login-in or use a different email.';
            return resp.status(400).json({ type: 'reg-failed', msg: error });
        } else{
            const curr_user = new User(
                {
                    uid : req.body.uid,
                    username: req.body.username,
                    email : req.body.email,
                    password : req.body.password,
                    role: req.body.role,   
                    isEnabled: req.body.isEnabled,                       
                    isVerified: req.body.isVerified,  
                    providerId: req.body.providerId
                }
            )
               curr_user.save(function(error_msg, curr_user){
                if (error_msg){
                    return next(error_msg);
                } else{
                        resp.status(200).send('saved info of curr_user');
                }
               })
            
        }
    }
})
    
}

exports.user_google_auth = function (req, res, next) {

    // Find if the user exists
    User.findOne({ email: req.body.email }, function (error_msg, currUser) {
        if (error_msg) { return next(error_msg); }
        else {
            if (!currUser) {
                const currUser = new User(
                    {
                        username: req.body.username,
                        email: req.body.email,
                        isVerified: true,
                        third_party: true
                    });
                currUser.save(function (error_msg, currUser) {
                    if (error_msg) { return next(error_msg); }
                    else {

                        const token_payload = {
                            id: currUser._id,
                            name: currUser.username,
                            email: currUser.email,
                            role: currUser.role,
                            active: currUser.isVerified
                        };
                        jwt.sign(token_payload, secret, { expiresIn: 36000 },
                            (error_msg, newToken) => {
                                console.log('->->->->->->->->->->', secret)
                                console.log('Generated token--->',token_payload )
                                if (error_msg) res.status(500)
                                    .json({
                                        error: "Token signing failed",
                                        raw: error_msg
                                    });
                                res.status(200).send({
                                    success: true,
                                    token: `Bearer ${newToken}`,
                                    user: { user_id: currUser._id, username: currUser.username, email: currUser.email, role: currUser.role, isVerified: currUser.isVerified }
                                });
                            });
                    }
                });
            }
            else {

                const token_payload = {
                    id: currUser._id,
                    name: currUser.username,
                    email: currUser.email,
                    role: currUser.role,
                    active: currUser.isVerified
                };
                jwt.sign(token_payload, secret, { expiresIn: 36000 },
                    (error_msg, newToken) => {
                        console.log('->->->->->->->->->->', secret)
                        console.log('Generated token--->',token_payload )
                        if (error_msg) res.status(500)
                            .json({
                                error: "Token signing failed",
                                raw: error_msg
                            });
                        res.status(200).send({
                            success: true,
                            token: `Bearer ${newToken}`,
                            user: { user_id: currUser._id, username: currUser.username, email: currUser.email, role: currUser.role, isVerified: currUser.isVerified }
                        });
                    });
            }
        }
    });
};


exports.user_auth = function (req, res, next) {

    // Find if the user exists
    User.findOne({ email: req.body.email }, function (error_msg, currUser) {
        if (error_msg) { return next(error_msg); }
        else {
            if (!currUser) {
                res.status(400).send({ type: 'auth-failed', msg: 'User not found' });
            } else if (currUser.third_party) {
                res.status(400).send({ type: 'auth-failed', msg: 'Third party authentication needed' });
            }
            else if (!currUser.isVerified) {
                res.status(400).send({ type: 'auth-failed', msg: 'Please verify the email to login' });
            }
            else if (!currUser.active) {
                res.status(400).send({ type: 'auth-failed', msg: 'User account is restricted by admin. Please try again later.' });
            }
            else {
                // Hash the password sent by the user and check if it matches the password in db
                argon2.verify(currUser.password, req.body.password).then(isPasswordMatch => {
                    // Password matches
                    if (isPasswordMatch) {
                        const token_payload = {
                            id: currUser._id,
                            name: currUser.username,
                            email: currUser.email,
                            role: currUser.role,
                            active: currUser.isVerified
                        };
                        jwt.sign(token_payload, secret, { expiresIn: 36000 },
                            (error_msg, newToken) => {
                                console.log('->->->->->->->->->->', secret)
                                console.log('Generated token--->',token_payload )
                                if (error_msg) res.status(500)
                                    .send({
                                        error: "Token signing failed",
                                        raw: error_msg
                                    });
                                res.json({
                                    success: true,
                                    token: `Bearer ${newToken}`,
                                    user: { user_id: currUser._id, username: currUser.username, email: currUser.email, role: currUser.role, isVerified: currUser.isVerified }
                                });
                            });
                        res.status(200).send({ newToken });
                    }
                    else { res.status(400).send({ type: 'auth-failed', msg: 'Password does not match. Please try again' }); }

                }
                );
            }
        }
    });
};

exports.privacy_policy = function (req, resp){
    policy = JSON.parse(fs.readFileSync(__dirname + '/data/policy.json','utf-8'));
    console.log("Policy backend");
    var policy_desc= []

    policy.forEach(element =>{
            policy_desc = element;
        })



        if(policy_desc.length<1){

            resp.status(404).send("Record not found");

        }

        else{

            resp.send(policy_desc);

        }

};

exports.edit_privacy_policy = function (req, resp){

    var policy_save = [];
    var obj = 
    {
        policy : req.body.policy
    };
    policy_save.push(obj);

    fs.writeFile(__dirname + '/data/policy.json', JSON.stringify(policy_save), function(err){

        if (err) throw err;

        console.log(`${req.body["policy"]}`);

        resp.send(obj);

    });
    
}