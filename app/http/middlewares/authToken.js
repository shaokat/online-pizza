const jwt = require("jsonwebtoken");
function authToken(req, res, next){
    try {
        const token = req.params.confirmationCode
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.flash('token',token)
        // req.token = {"token": token}
        next()
    } catch (error) {
       req.flash('error','token is invalid or has expired.')
       console.log('invalid '+error)
       return res.redirect('/forget-password')
   
    }
}
module.exports = authToken