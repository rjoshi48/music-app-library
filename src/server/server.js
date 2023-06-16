const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');


const passport = require('passport');
const mongoose = require('mongoose');

const open = require('./routes/open.route');
const admin = require('./routes/admin.route');
const secure = require('./routes/secure.route');

const env_path = process.cwd()+'\\config\\env-config.env';
require('dotenv').config({path : env_path}); 
const serverUtils = require('./serverUtils.js');

const app = express();
app.use(cors());

console.log("Inside server js");

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  });
  //mongodb://127.0.0.1:27017/
// Set up mongoose connection
let dev_db_url = 'mongodb://127.0.0.1:27017/musiclibrary';
const mongoDB =  dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(mongoDB);
//mongoose.connect(mongoDB).catch(error => logger(`Error in DB Connection ${error}`));
//mongoose.connection.on('error', error => logger(`Error in DB Connection ${error}`));
//mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

manageAccess = (requestedAuthLevel) => {
  return (req, res, next) => {
         if(req.user.role === requestedAuthLevel || req.user.role === 'admin')
          {
              return next();
          }
          else
          {
              return res.status(403).send('Unauthorized User!! Please refrain from acessing');
          }
  };
};

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/open', open);
app.use('/api/secure',[passport.authenticate('jwt', {session: false}),validateRouteAccess.permissonLevel('user')], secure);

const port = 1000;
app.listen(port, () => console.log(`listening on port ${port}`));

