// App for CodeFreak blogs

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')



const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');


app.get('/',(req,res) => res.render('index.ejs'));

app.get('/about',(req,res) => res.render('about.ejs'));

app.get('/contacts',(req,res) => res.render('contacts.ejs'));

app.get('/compose',(req,res) => res.render('compose.ejs'));

app.get('/posts',(req,res) => res.render('posts.ejs'));


app.listen(3000,() => console.log('App is listening on port : 3000'));