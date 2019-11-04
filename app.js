const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const index = require('./routes/index');
const crypto = require('crypto');
const path = require('path');

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const app = express();

//connect to mongodb
// mongoose
// .connect('mongodb://localhost:27017/dir', {useNewUrlParser: true, useUnifiedTopology: true})
// .then(() => console.log('mongodb connected'));
// const conn = mongoose.connection;



// mongoose.connect("mongodb+srv://admin:admin@cluster0-demqr.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
// .then(()=>{console.log('mongodb connected')})
// .catch(err => console.log(err));
// const conn = mongoose.connection;

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.use(require("express-session")({
    secret: "glitch free technologies",
    resave:   false,
    saveUninitialized:  false
  }));

  // conn.once('open', ()=>{
  //   // init stream
  //   gfs = Grid(conn.db, mongoose.mongo);
  //   gfs.collection('uploads');
  // });

// passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

// passport Config
// require('./config/passport')(passport);



// app.get('/g', (req, res)=> res.send('goowdsoss'));


//use routes
// app.use('/api/users', users)
app.use(index);

const port = process.env.PORT||3000;
app.listen(port, () => console.log(`server is running on port ${port}`));