function auth(req, res, next){
    console.log('auth')
    if(req.user.status != 'Active'){
    
        req.flash('error', "Email not varified!" );
        return res.redirect('/login')
    }
    if(req.isAuthenticated() && req.user.status === 'Active'){
        console.log('authenticated')
        return next()
    }
    else{
        console.log('else')
        return res.redirect('/login')
    }
}
module.exports = auth