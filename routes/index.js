const express = require('express');
const router = express.Router();
const Business = require("../models/business");
const User = require("../models/user");
const middleware = require("../middleware");

const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


const passport = require('passport');
// const middleware = require("../middleware/index");





// mongoose
// .connect('mongodb://localhost:27017/dir', {useNewUrlParser: true, useUnifiedTopology: true})
// .then(() => console.log('mongodb connected'));
// const conn = mongoose.connection;

mongoose.connect("mongodb+srv://admin:admin@cluster0-demqr.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log('mongodb connected')})
.catch(err => console.log(err));
const conn = mongoose.connection;

let gfs;

conn.once('open', ()=>{
  // init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
    // url: 'mongodb+srv://admin:admin@cluster0-7oamo.mongodb.net/africave?retryWrites=true&w=majority',
    url: 'mongodb://localhost:27017/dir',
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });





router.get('/', (req,res)=>{
  Business.find({}, (err, business)=>{
    // Business.find({business_type: "hotel"}, (err, business)=>{
    // console.log(business);
    if (err){
      console.log(err);
    }  else{
      // console.log(business);
      gfs.files.find().toArray((err, files)=>{
        // console.log(files)
        if(!files || files.length === 0){
          res.render('index', {files: false, business:business});
        } else{
          files.map(file =>{
            if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
                file.isImage = true;
            } else {
              file.isImage = false;
            }
          });
          res.render('index',{files: files, business:business});
        } 
    
      })
    }
  })
  
});

router.get('/business/:type', (req,res)=>{
  Business.find({business_type:req.params.type}, (err, business)=>{
    // Business.find({business_type: "hotel"}, (err, business)=>{
    // console.log(business);
    if (err){
      console.log(err);
    }  else{
      // console.log(business);
      gfs.files.find().toArray((err, files)=>{
        // console.log(files)
        if(!files || files.length === 0){
          res.render('index', {files: false, business:business});
        } else{
          files.map(file =>{
            if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
                file.isImage = true;
            } else {
              file.isImage = false;
            }
          });
          res.render('index',{files: files, business:business});
        } 
    
      })
    }
  })
  
});

// router.get('/business/:type', (req,res)=>{
//   Business.find({}, (err, business)=>{
//   // Business.find({business_type: req.params.type}, (err, business)=>{
//     // console.log(business);
//     if (err){
//       console.log(err);
//     }  else{
//       // console.log(business);
//       gfs.files.find().toArray((err, files)=>{
//         // console.log(files)
//         if(!files || files.length === 0){
//           res.render('index', {files: false, business:business});
//         } else{
//           files.map(file =>{
//             if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
//                 file.isImage = true;
//             } else {
//               file.isImage = false;
//             }
//           });
//           res.render('index',{files: files, business:business});
//         } 
    
//       })
//     }
//   })
// });

router.get('/business/single/:id', (req,res)=>{
  Business.findById(req.params.id, (err, business)=>{
    // console.log(business);
    if (err){
      console.log(err);
    }  else{
          res.render('single_business', {business:business});
          // res.render('listing-explore-property-profile', {business:business});
        } 
  })
  
});



router.get('/add', middleware.isLoggedIn, (req,res)=>{
    res.render("add-place-listing"); 
    
});



// router.post('/upload', upload.single('file'), (req,res)=>{
//   // res.json({file:req.file});
//   res.redirect('/upload');
// })

// router.get('/uploads', (req,res)=>{
//   gfs.files.find().toArray((err, files)=>{
//     if(!files || files.length === 0){
//       res.render('try', {files: false});
//     } else{
//       files.map(file =>{
//         if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
//             file.isImage = true;
//         } else {
//           file.isImage = false;
//         }
//       });
//       res.render('try',{files: files});
//     } 

//   })
// })


router.get('/image/:filename', (req,res)=>{
  gfs.files.findOne({filename:req.params.filename},(err, file)=>{
    if(!file || file.length === 0){
      return res.status(404).json({
        err: "no files "
      })
    }
    // return res.json(file);
    if(file.contentType === 'image/jpeg' || file.contentType === 'img/png'){
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      return res.status(404).json({
        err: "no files "
      })
    }
  })
})





// router.post('/submit', upload.single('file'),  (req,res)=>{
router.post('/submit', upload.any(),  (req,res)=>{
    console.log(req.files);
    // console.log(req.files[0].id);
    const business = {
        business_name: req.body.business_name,
        business_email: req.body.business_email,
        business_number: req.body.business_number,
        business_website: req.body.business_website,
        business_type: req.body.business_type,
        business_location: req.body.business_location,
        business_descr: req.body.business_descr,
        business_image: req.body.business_image,
        business_logo: req.files[0] ? req.files[0].filename   : "",
        business_image: req.files[1] ? req.files[1].filename   : "",
        business_gallery1: req.files[2] ? req.files[2].filename   : "",
        business_gallery2: req.files[3] ? req.files[3].filename   : "",
        business_gallery3: req.files[4] ? req.files[4].filename   : "",
        business_gallery4: req.files[5] ? req.files[5].filename   : ""
        }
Business.create(business, (err, newBusiness)=>{
    if(err){
        console.log(err)
    }
    res.redirect("/");
})
// res.redirect("/");
});


router.post("/register/now", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
      if (err){
          console.log(err);
          return res.redirect("/error");
      }   else {
          passport.authenticate("local")(req, res, function(){
              res.redirect("/"); 
          });
      }
  });
});

router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/",
    failureRedirect: "/error"
}), function(req, res){    
});

router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

module.exports = router;