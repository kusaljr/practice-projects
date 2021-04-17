const express = require('express')
const app = express()
const cors = require('cors')
const server = require('http').createServer(app)
const passport = require('passport');
const flash = require('express-flash');
const io = require('socket.io')(server, {cors:{ origin: "*"}})
const stockRouter = require('./routes/stock')
const pollRouter = require('./routes/poll')
const session = require('express-session');
const methodOverride = require('method-override');
const auth = require('./routes/user')

const mongoose = require('mongoose')
const MongoDbStore = require('connect-mongo')(session)
var marketData = require('./public/datas/data.json')
app.use(cors())

//mongo connection
mongoose.connect('mongodb://localhost/stock', {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true
})
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

//session and passport
app.use(express.urlencoded( { extended : false }));
app.use(session({
    secret : 'kusaljr',
    resave : false,
    store: mongoStore,
    saveUninitialized : false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));


//global session declaration
app.use((req, res, next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    res.locals.marketData = marketData 
    next()
  })

//setups
app.set('view engine', 'ejs')
app.use(express.static('public'))



//routes
app.use('/api', pollRouter)
app.use('/stock', stockRouter)
app.use('/users', auth)


//server
app.get('/home', (req, res)=>{
    res.render('index')
})

app.get('/api', (req, res)=>{
    res.json(gender)
})

server.listen(3000, ()=>{
    console.log('Server started running on port 3000')
})



io.on('connection',(socket)=>{
    socket.on('message',(data)=>{
        socket.emit('message', data)
        socket.broadcast.emit('message', data)
    })
})