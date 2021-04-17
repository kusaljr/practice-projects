const express = require('express')
const router = express.Router()
const top_gainer = require('../public/datas/top-gainer.json')
const top_loser = require('../public/datas/top-loser.json')
const data = require('../public/datas/company/nifra-data.json')
const detail = require('../public/datas/company/nifra-detail.json')
const allData = require('../public/datas/data.json')
const Stock = require('../models/stock')
const User = require('../models/users')
const { auth, notAuth } = require('../middleware/auth');
const fetch = require('node-fetch')

const body ={"offset": 1, "limit": "15", "categoryID": 2, "portalID": "1", "cultureCode": "en-US", "StockSymbol": ""} 




router.get('/', (req, res)=>{
    fetch('https://nepalipaisa.com/Modules/Investment/webservices/InvestmentService.asmx/GetAllInvestmentInfobyCategoryID', { 
        method: 'POST', 
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json'},
})
    .then(res => res.json()) // expecting a json response
    .then(json =>{
        res.render('stock/index', {company:json.d})
    } );
})

router.post('/', (req, res)=>{
    let stockName = req.body.stock
    let amount = req.body.quantity
    let price = detail.securityDailyTradeDto.lastTradedPrice
    let totalPrice = amount * price

    if(totalPrice > req.user.capital){
        res.send('<script>alert("ओ गरिब!"); window.location.href = "/stock/buy"; </script>');
    }else{
        const stockPost = new Stock({
        userId : req.user._id,
        StockName : stockName,
        quantity : amount,
        price :  totalPrice
        })
        
        User.findOne(
            {_id :req.user.id}, (err, doc)=>{
                doc.capital = doc.capital - totalPrice
                doc.save().then(result=>{
                }).catch(err=>{
                    console.log(err)
                })         
            }
        )
        stockPost.save().then(result=>{
            req.user.capital -=totalPrice   
            res.redirect('/stock/portofolio')
        }).catch(err =>{
            console.log(err)
        })

    }
    
})

router.get('/portofolio',auth, async (req, res)=>{
    const userStock = await Stock.find({
        userId: req.user._id
    })
    res.render('stock/Market/portofolio', {userStock:userStock })
} )

router.get('/sell',auth, async (req, res)=>{
    const userStock = await Stock.find({
        userId: req.user._id
    })

    /*
    seatWithCat = userStock
    result = [];

    seatWithCat.forEach(function (o) {
    if (!this[o.StockName]) {
        this[o.StockName] = { _id:o._id, userId : o.userId,StockName: o.StockName, price: o.price, quantity: o.quantity};
        result.push(this[o.StockName]);
        return;
    }
    this[o.StockName].quantity += o.quantity;
    this[o.StockName].price += o.price;

    }, Object.create(null));
    */

    res.render('stock/Market/sell', {userStock:userStock, detail:detail})
})

router.delete('/:id',auth, async (req, res)=>{
   const stockDelete = await Stock.findById(req.params.id)
   let amount = detail.securityDailyTradeDto.lastTradedPrice * stockDelete.quantity 

   User.findOne(
    {_id :req.user.id}, (err, doc)=>{
        doc.capital = doc.capital + amount
        doc.save().then(result=>{
        }).catch(err=>{
            console.log(err)
        })         
    }
    )
   await Stock.findByIdAndDelete(req.params.id)
   res.redirect('/stock/portofolio')   

})

router.get('/buy',auth, (req, res)=>{
    res.render('stock/Market/buy', {
        top_gainer:top_gainer,
        top_loser:top_loser
    })
} )


router.get('/apidata', auth, (req, res)=>{
    res.json(data)
})

router.get('/:stock', auth, (req, res)=>{
    res.render('stock/Market/visualize', {
        detail:detail, 
        data:data
    })
})


module.exports = router