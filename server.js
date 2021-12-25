const express = require("express")
const app = express()
const ejs = require("ejs")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
const res = require("express/lib/response")


const PORT = process.env.PORT || 4000

app.use(express.static('public'))

//set Template enjine

app.use(expressLayouts)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

app.get('/', (req,res) => {
    res.render('home')
})

app.get('/login', (req,res) => {
    res.render('auth/login')
})

app.get('/register', (req,res) => {
    res.render('auth/register')
})

app.get('/cart', (req,res) => {
    res.render('customers/cart')
})

const  start = async () => {
    app.listen(PORT, ()=>{
        console.log(`app listing on port ${PORT}`)
    })
} 

start()