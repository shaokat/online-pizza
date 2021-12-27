const authController = require('../controllers/authController')
const homeController = require('../controllers/homeController')
const cartController =  require('../controllers/customers/cartController')
function initRoutes(app){
    app.get('/',homeController().index)
    app.get('/cart',cartController().cart)
    app.post('/update-cart',cartController().updateCart)
    app.get('/login',authController().login)
    app.get('/register',authController().register)
}



module.exports = initRoutes