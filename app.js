// App for CodeFreak blogs

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/cfblogsDB",{urlencoded:true});

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

// const date = new Date().getDate();
let Year = new Date().getFullYear();


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
        res.render('compose.ejs',{year:Year});
    })

    .post((req,res) => {
        res.render('Still working on it !!');
    });


// About Route
app.get('/about',(req,res) => res.render('about.ejs',{year:Year}));


// Contacts Route
app.get('/contacts',(req,res) => res.render('contacts.ejs',{year:Year}));


// Custom posts Route
app.get('/posts/:postId',(req,res) => {
    const req_post = req.params.postId;
    
    Post.findOne({_id:req_post},(err,post) => {
      if(!err)
        res.render("posts.ejs",{post_title:post.postTitle,
            posted_on:post.postDate,
            post_subject:post.postSub,
            post_content:post.postContent,
            year:Year
        });
  
      else
        console.log(err);
    });
  
  })
  


app.listen(3000,() => console.log('App is listening on port : 3000'));