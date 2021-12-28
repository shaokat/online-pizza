const authController = require('../controllers/authController')
const homeController = require('../controllers/homeController')
const cartController =  require('../controllers/customers/cartController')
const guest = require('../app/http/middlewares/guest')
function initRoutes(app){
    app.get('/',homeController().index)
    app.get('/cart',cartController().cart)
    app.post('/update-cart',cartController().updateCart)
    app.get('/login', guest, authController().login)
    app.post('/login',authController().postLogin)
    app.post('/logout',authController().logout)
    app.get ('/register',guest,authController().register)
    app.post('/register',authController().postRegister)
}



module.exports = initRoutes