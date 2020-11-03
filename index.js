const cheerio = require('cheerio')
const request = require('request')
const express = require('express')
const app = express()
let port = process.env.PORT || 3000;

app.get('/lyrics', function(req, res){
    var queryParmeter = req.query;
    const urlParse = 'https://www.google.com/search?q='
    var lyrics = queryParmeter.title
    const fetchURL = `${urlParse}${lyrics} lyrics`
    request(fetchURL, (error, response, html) => {
        if(!error & response.statusCode == 200) {
            const $ = cheerio.load(html)
    
            const siteHeading = $('.xpc')

            res.json([
                {urlParameter :queryParmeter},
                {result: siteHeading.text()}
            ])
           
        }
    })
}) 

app.get('/', function(req, res){

    res.json({
        Steps: '/lyrics/(Song Name)',
        example: 'https://liverpool-api.herokuapp.com/lyrics?title=sim sime pani vten'
    })

})

app.listen(port, function(){
    console.log('Listening to Server!')
})

