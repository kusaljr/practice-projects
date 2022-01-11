require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo').default
const passport = require('passport')
const Emitter = require('events')
//Database Connection
const url = 'mongodb://localhost/Restro'
mongoose.connect(url, {
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
})
const connection = mongoose.connection
connection.once('open', ()=>{
    console.log('Database Connected')
}).catch(err => {
    console.log('Connection Failed...')
})


//Session Store
let mongoStore = MongoDbStore.create({
    mongoUrl: url,
    collectionName: "sessions",
})

//event emitter
const eventEmitter  = new Emitter()
app.set('eventEmitter', eventEmitter)


//Session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24
    }
}))
app.use(flash())

// Passport Config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


//Assets
app.use(express.static('public'))
app.use(express.urlencoded({
    extended:false
}))
app.use(express.json())


//Global Middleware
app.use((req, res, next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')


require('./routes/web')(app)



const server = app.listen(PORT, ()=>{
    console.log(`Listening in Port ${PORT}`)
})


//socket
const io = require('socket.io')(server)

io.on('connection', (socket)=>{
    socket.on('join',(orderId)=>{
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('OrderUpdated', data)
})