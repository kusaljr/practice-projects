const mongoose = require('mongoose')

const stockSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    StockName:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required: true
    },
    price:{
        type:Number,
        required: true
    }
},{timestamps:true})

module.exports = mongoose.model('Stocks',stockSchema)