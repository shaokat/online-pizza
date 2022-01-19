const { default: axios } = require("axios");
const { render } = require("ejs");
const jwt = require("jsonwebtoken");
const User = require("../app/models/user");


const {sendMail, hello} = require('./emailController')
function passwordController(){
    return{
        forgetPassword(req,res,next){
            return res.render('auth/forgotPassword')

        },
        postForgetPassword(req,res,next){
            const{email} = req.body
            const token = jwt.sign({email: email}, process.env.JWT_SECRET,
                {expiresIn:process.env.JWT_LIFETIME})
            
                sendMail('reset-password',email,token,req)
                req.flash('success', 'eamil has been sent please follow the instruction')
                return res.redirect('/forget-password')


        },

        resetPassword(req,res){
            res.render('auth/resetPassword')

        },
        postResetPassword(req,res,next){
            const token = req.params.token
            try{
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            const email =  payload.email
            User.findOne({email:email}).then(user=>{
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('/forget-password');
                  }
                user.password = req.body.password
                user.save((err) => {
                    if (err) {
                    req.flash('error', "something went wrong!" )
                      return  res.redirect('/forget-password')
                    }
                    else{
                        req.flash('success', " Password updated successfully!" );
                        sendMail('password-changed',email,'','')
                        return res.redirect('/login')
                    }
                  });
            }).catch((e) => {
                req.flash('error', "something went wrong!" )
                return  res.redirect('/forget-password')
            });

        }
        catch(error){
            req.flash('error', "Password reset token is invalid or has expired.")
            return res.redirect('/forget-password')

        }
    }

        
    }
}

module.exports=passwordController