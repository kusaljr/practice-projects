const order = require("../../../models/order")


function orderController() {
    return {
        index(req, res) {
            try{
                order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
                    if(req.xhr) {
                        return res.json(orders)
                    } else {
                     return res.render('admin/orders')
                    }
                })

            }catch(err){
                console.log(err)
            }

        }
    }
}

module.exports = orderController