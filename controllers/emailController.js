const nodemailer = require("nodemailer");

const sendMail = (toLink, toEmail,token,req)=>{
    let subject= ''
    let text= ''
    let link= ''
    if(toLink === 'register'){
        link = "http://"+req.get('host')+"/register/confirm/"+token;
        subject= 'Please confirm your Email account'
        text = `Hello ${req.body.name}, Please Click on the link to verify your email.or paste this into your browser to complete the process:
        ${link}`

    }
    else if(toLink === 'reset-password'){
        link = "http://"+req.get('host')+"/reset-password/confirm/"+token;
        subject= 'Password Reset'
        text = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n'+ link +'\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'

    }

    else if(toLink === 'password-changed'){
        subject = 'Your password has been changed',
        text =  'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + toEmail + ' has just been changed.\n'
    }

    const smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.HOST_EMAIL,
            pass: process.env.PASSWORD
        }
    });

    
    const mailOptions={
        to : toEmail,
        subject: subject,
        text: text
    }
    smtpTransport.sendMail(mailOptions, function(err, info){
      
        if(err){
                console.log(error);
                req.flash('error', 'eamil could not sent please try again!')
           
        }else{
                req.flash('success', 'eamil has been sent please follow the instructions!')
           
            }
    });
}

    module.exports = {sendMail}


