const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/articles')
const articleRouter = require('./routes/article')
const authRouter = require('./routes/auth')
const methodOverride = require('method-override')
const app = express()


mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true
})

app.use(require("express-session")({
    secret:"Rusty is the best og in the world",
    resave: false,
    saveUninitialized: false
}));


app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))



app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles, isLoggedin:false })
})

app.use('/articles', articleRouter)
app.use('/auth', authRouter)



app.listen(5000) 
