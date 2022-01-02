const authController = require('../controllers/authController')
const homeController = require('../controllers/homeController')
const cartController =  require('../controllers/customers/cartController')

const orederController = require('../controllers/customers/orderController')
const adminController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')

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
    
    //customer routes
    app.post('/orders', orederController().store)
    app.get('/customer/orders',auth, orederController().index)
    app.get('/customer/orders/:id',auth, orederController().show)

    //admin route
    app.get('/admin/orders',admin, adminController().index)
    app.post('/admin/order/status',admin, statusController().update)
}



module.exports = initRoutes