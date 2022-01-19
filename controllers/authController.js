const User = require("../app/models/user")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const passport = require("passport")
const {sendMail, hello} = require('./emailController')
function authController(){

    
    const _getRedirectUrl = (req) =>{
        return req.user.role == 'admin' ? 'admin/orders' : 'customer/orders'
    }
    return{

    
        login(req, res){
            res.render('auth/login')
        },
        postLogin(req, res, next){
            
            const{email, password } = req.body


            if(!email || !password){
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local',(err, user, info)=>{
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }

                if (user.status != "Active") {
                    req.flash('error', 'please varify your email')
                    return res.redirect('/login')
                }

                req.logIn(user,(err)=>{
                    if(err){
                        req.flash('error', err)
                        return next(err)
                    }

                    
                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)

        },
        register(req, res){
            res.render('auth/register')
        },
        
        async postRegister(req, res){
            const{name, email, password, rpassword } = req.body

            if(!name || !email || !password || !rpassword){
                req.flash('error', 'All fields are required')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            //check both passwords match

            if(password != rpassword){
                req.flash('error', 'Passwords did not match!')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }


            //check if email exist
            User.exists({email: email}, async (error, result)=>{
                if(error){
                    req.flash('error', 'Something went wrong')
                        return res.redirect('/register')
                }
                if(result){
                    req.flash('error', 'Email already taken')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
                else{
                    const hashedPassword = await bcrypt.hash(password,10)
                    rand=Math.floor((Math.random() * 100) + 54);

                    //Generate tokent
                    console.log(email)
                    let token= ''
                    token = jwt.sign({email: email,name:name}, process.env.JWT_SECRET,
                        {expiresIn:process.env.JWT_LIFETIME})

                        // const token = jwt.sign({userId:req.email,name:req.name}, process.env.JWT_SECRET,
                            //   {expiresIn:process.env.JWT_LIFETIME})
                    //create user
                    const user = {
                        name: name,
                        email: email,
                        password: password,
                    }
                    
                    User.create(user).then((user)=>{
                        // _sendMail(email,rand,req)
                        console.log('save')
                        sendMail('register',email,token,req)
                        req.flash('success', 'eamil has been sent please varify')
                        //Login
                        return res.redirect('/register')
                    }).catch(err=>{
                        req.flash('error', 'Something went wrong')
                        return res.redirect('/register')
                    })
                        }
                    })
                  
        },
        logout(req, res){
            req.logout()
            return res.redirect('/login')
        },

         verifyUser(req, res, next){

            const token = req.params.confirmationCode
            try{
                const payload =  jwt.verify(token, process.env.JWT_SECRET)
                 User.findOne({
                email: payload.email,
            }).then((user) => {
                
                if (!user) {
                  console.log('not found')
                  return req.flash('error', "User Not found." );
                  
                }
                if(user.status != "Active"){
                    
                    User.findByIdAndUpdate({_id:user._id},{status:"Active"},(err) => {
                        if (err) {
                          return  res.redirect('/register')
                        }
                        else{
                            req.flash('success', "User  activated successfully!" );
                            return res.redirect('/login')
                        }
                      });

                }
                else if(user.status === "Active"){
                    console.log('else if')
                    req.flash('error', "User already activated" );
                    return res.redirect('/login')
                }   
                
              }).catch((e) => console.log("error", e));
            }

            catch(error){
                console.log("error"+error)
                req.flash('error','token expired')
                return res.redirect('/register')
            };
              
            

            // User.findOne({
            //   confirmationCode: req.params.confirmationCode,
            // })
            //   .then((user) => {
            //     if (!user) {
            //       console.log('not found')
            //       return req.flash('error', "User Not found." );
                  
            //     }
            //     user.status = "Active";
            //     user.save((err) => {
            //       if (err) {
            //         return  res.redirect('/register')
            //       }
            //     });
            //   })
            //   .catch((e) => console.log("error", e));
            //   return res.redirect('/login')

        }

    }
}

module.exports = authController