var express                 = require("express"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("../models/user"),
    LocalStrategy = require('passport-local')


const Article = require('../models/articles')
const isLoggedIn = require('../middleware/login')

const app = express.Router();
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
    res.render("authentication/login");
});

app.get("/",isLoggedIn, async function(req,res){
    const articles = await  Article.find().sort({ createdAt: 'desc' })
    res.render("articles/index",{articles:articles, isLoggedin:true});
});

// Auth Routes

app.get("/register", function(req, res){
    res.render("authentication/register");
});
//handling user sign up
app.post("/register", function(req, res){
User.register(new User({username:req.body.username}),req.body.password, function(err, user){
       if(err){
            console.log(err);
            return res.render('authentication/register');
        } //user stragety
        passport.authenticate("local")(req, res, function(){
            res.redirect("authentication/login"); //once the user sign up
       }); 
    });
});

// Login Routes

app.get("/login", function(req, res){
    res.render("authentication/login");
})

// middleware
app.post("/login", passport.authenticate("local",{
    failureRedirect:"authentication/login"
}),async function(req, res){
    const articles = await  Article.find().sort({ createdAt: 'desc' })
    res.render("articles/index",{articles:articles, isLoggedin:true});
});






module.exports = app
