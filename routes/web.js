const authController = require('../controllers/authController')
const homeController = require('../controllers/homeController')
const cartController =  require('../controllers/customers/cartController')

const orederController = require('../controllers/customers/orderController')
const adminController = require('../app/http/controllers/admin/orderController')


//Middlewares 
const auth = require('../app/http/middlewares/auth')
const guest = require('../app/http/middlewares/guest')
const admin = require('../app/http/middlewares/admin')
function initRoutes(app){
    app.get('/',homeController().index)

    app.get('/cart',cartController().cart)
    app.post('/update-cart',cartController().updateCart)

    app.get('/login', guest, authController().login)
    app.post('/login',authController().postLogin)
    app.post('/logout',authController().logout)

    app.get ('/register',guest,authController().register)
    app.post('/register',authController().postRegister)

    app.post('/orders', orederController().store)
    app.get('/customer/orders',auth, orederController().index)

    app.get('/admin/orders',admin, adminController().index)
}



module.exports = initRoutes