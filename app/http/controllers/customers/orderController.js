const Order = require('../../../models/order')

function orderController(){
    return {
        store(req, res){
            const {phone, address} = req.body
            //Validate Request
            if(!phone || !address){
                req.flash('error', 'All Fields are Required')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone:phone,
                address:address
            })

            order.save().then(result =>{
                req.flash('success', 'Order Placed Successfully')
                delete req.session.cart
                return res.redirect('/customer/orders')

            }).catch(err =>{
                req.flash('error', 'Something went wrong')
                return res.redirect('/cart')
            })

        },
        
        async index(req, res){
            const orders = await Order.find({
                customerId: req.user._id
            }, null, {sort:{'createdAt':-1}}) 

            res.header('Cache-Control', 'no-cache, privare, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')

            res.render('customers/orders',{orders:orders})
        },
        
        async show(req, res){
            const order =await Order.findById(req.params.id)
            //Authorize User 
            if(req.user._id.toString() === order.customerId.toString()){
                return res.render('customers/singleOrder', {
                    order: order
                })
            }
            return res.redirect('/')
        }

    }
}

module.exports = orderController