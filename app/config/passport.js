const LocalStrategy = require('passport-local').Strategy
const User = require("../models/user")
const bcrypt = require('bcrypt')
  function  init(passport){
     passport.use(new LocalStrategy({usernameField: 'email'},(email, password, done)=>{
        //Login
        //check if email exists

         User.findOne({email: email}).then(user =>{
            if(!user){
                return done(null,false,{message: 'No user found with this email'})
            }
            bcrypt.compare(password, user.password).then( match =>{
                if(match){
                    return done(null,user,{message: 'Logged in Successful'})
                }
    
                return done(null,false,{message: 'wrong username or password'})
                
            })
        }).catch(err=>{
            return done(null,false,{message: 'something went wrong'})
        })

    }))

    passport.serializeUser((user, done) =>{
        done(null,user._id)
    })

    passport.deserializeUser((id,done)=>{
        User.findById(id, (err, user)=>{
            done(err,user)
        })
    })
}

module.exports = init

