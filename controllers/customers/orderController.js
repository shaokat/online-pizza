const moment = require('moment')
const Order = require('../../app/models/order')
function orederController(){
    return{
        store(req,res){
            console.log('store')
            const{phone, address} = req.body
           if(!phone || !address){
               req.flash('error', 'All fields are required')
               return res.redirect('/cart')
           }


           const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
           })

           order.save().then(result =>{
            Order.populate(result, {path: 'customerId'}, (err, placedOrder) =>{
                if(err){
                console.log('cart')
                req.flash('error', 'Something went wrong')
                return res.redirect('/cart')
                }
                console.log('orders')
                req.flash('success', 'Order placed successfully')
                delete req.session.cart
                //Emit 
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderPlaced', result)
                return res.redirect('/customer/orders')
               })
               
            })
            

        },

        async index(req, res){
            console.log('index')
            const orders = await Order.find(
                {customerId: req.user._id}, 
                null,
                 {sort: {'createdAt': -1}})
            res.header('Cache-Control', 'no-cache, private, no-store,must-revalidate, max-stale=0, post-check=0,pre-check=0')
            res.render('customers/orders', {orders: orders, moment:moment})
           
        },

        async show(req, res){
            console.log('show')
            const order = await Order.findById(req.params.id)

            //Authorize user
            if(req.user._id.toString() === order.customerId.toString()){
               return res.render('customers/singleOrder',{order})
            }

            return res.redirect('/')
        }
    }
}

module.exports = orederController