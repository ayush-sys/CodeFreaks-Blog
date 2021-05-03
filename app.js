// App for CodeFreak blogs


require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { result } = require('lodash');


let date = new Date().toLocaleDateString();
let Year = new Date().getFullYear();


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');

mongoose.connect(process.env.mongodb_loc,{urlencoded:true});

const postSchema = {
    postTitle:String,
    postSub:String,
    postContent:String,
    postDate:String
};

const Post = new mongoose.model('Post',postSchema);

const welcomePost = new Post({
    postTitle:"Post-1",
    postSub:"Welcome Message",
    postContent:"Hello world. It's my first version of my personal blogging website. I will continue to post some random thoughts of mine and even some secrets !! So if you don't want to miss anything or u are just curious to know about me then I guess this website will help as a bridge between you and me. So Keep Posting Keep Exploring !!",
    postDate:"00-00-0000"
});


var transporter = nodemailer.createTransport({
    service: process.env.user_email_service,
    auth: {
      user: process.env.user_email,
      pass: process.env.user_pwd
    }
});


// Home Route
app.route('/')
    .get((req,res) => {

        Post.find({},(err,postItem) => {
            if(postItem.length === 0){
                welcomePost.save();
                res.redirect('/');
            }
            else
            res.render('index.ejs',{post:postItem,year:Year});
        });
    });
    

// Compose Route
app.route('/compose')
    .get((req,res) => {
        res.render('compose.ejs',{todayDate:date,year:Year});
    })

    .post((req,res) => {
        const newPost = new Post({
            postTitle:req.body.post_title,
            postSub:req.body.post_sub,
            postContent:req.body.post_desc,
            postDate:req.body.post_date
        });
        
        newPost.save();

        res.redirect('/');
    });


// About Route
app.get('/about',(req,res) => res.render('about.ejs',{year:Year}));


//Admin LogIn Route
app.route('/login')
    .get((req,res) => res.render('login.ejs',{year:Year}))
    .post((req,res) => res.render('Still not ready!!'));



//Admin Route
app.route('/admin')
    .get((req,res) => {
        Post.find({},(err,postItem) => {
            res.render('admin.ejs',{posts:postItem,year:Year});
        });
    })

    .post((req,res) => {
        res.render("Function not ready !");
    });



// Contacts Route
app.route('/contacts')
    .get((req,res) => res.render('contacts.ejs',{year:Year}))

    .post((req,res) => {  
        var mailOptions = {
            from: process.env.user_email,
            to: process.env.user_email,
            subject: req.body.firstName + " " + req.body.lastName + " has sent you a message!",
            html: "<h3>Subject: " + req.body.subject + "</h3><br>" + 
            "<h4>Message: " + req.body.message + "</h4><br>" + 
            "<h4>Email: " + req.body.email + "</h4><br>"
        };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (!error) {
              res.redirect('/');
            } else {
                console.log(error);
            }
        });

    });


// Custom posts Route
app.get('/posts/:postId',(req,res) => {
    const req_post = req.params.postId;
    
    Post.findOne({_id:req_post},(err,post) => {
      if(!err)
        res.render('posts.ejs',{post_title:post.postTitle,
            posted_on:post.postDate,
            post_subject:post.postSub,
            post_content:post.postContent,
            year:Year
        });
  
      else
        console.log(err);
    });
  
  })

  

//delete a particular post
app.delete('/posts/delete/:postId',(req,res) => {
    Post.findByIdAndDelete(req.params.postId).then(result => {
        res.json({redirect: '/admin'});
    })
});




//Edit a particular post Route
app.route('/posts/edit/:postId')
    .get((req,res) => {

        let req_post = req.params.postId;

        Post.findOne({_id:req_post},(err,post) => {
            if(!err)
              res.render('editpost.ejs',{post_title:post.postTitle,
                  post_date:post.postDate,
                  post_subject:post.postSub,
                  post_content:post.postContent,
                  post_id:post._id,
                  year:Year
              });
        
            else
              console.log(err);
          });
    })

    .post((req,res) => res.send("Still not ready!!"));




app.listen(process.env.PORT,() => console.log('App is listening on port : 3000'));