require('dotenv').config();
const express = require("express")
const app = express()
const ejs = require("ejs")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
const res = require("express/lib/response")
const mongoose =  require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo');
const passport = require('passport')
const Emitter = require('events')

const PORT = process.env.PORT || 4000

const url = process.env.MONGO_URL
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', ()=>{
  console.log('Database coneected...');
}).on('error',err =>{
  console.log('connection failed...'+err)
})

//Event emitter

const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

//session config
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave:  false,
  store: MongoDbStore.create({mongoUrl:process.env.MONGO_URL}),
  saveUninitialized: false,
  cookie: {maxAge: 1000*60*60*24} //24 hours
  // cookie: {maxAge: 1000*15}

}))

//passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())


//Asset
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Global middleware
app.use((req,res,next)=>{
  res.locals.session = req.session
  res.locals.user = req.user
  next()
})

//set Template enjine

app.use(expressLayouts)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

//route 
require('./routes/web')(app)


const server = app.listen(PORT, () =>{
        console.log(`Server is listening on port ${PORT}...`)
})

const io =  require('socket.io')(server)
io.on('connection', (socket)=>{
  // Join
  socket.on('join',(roomName)=>{
    socket.join(roomName)

  })
})

eventEmitter.on('orderUpdated', (data)=>{
  io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced', (data)=>{
  io.to('adminRoom').emit('orderPlaced',data)
})
