const cheerio = require('cheerio')
const request = require('request')


const url = 'https://www.google.com/search?q='
let lyrics

if (process.argv.length != 3){
    console.log("Please pass Song Name which you want to find lyrics of!")
}
else{

    lyrics = process.argv[2] ;
}

const fetchURL = `${url}${lyrics} lyrics`

request(fetchURL, (error, response, html) => {
    if(!error & response.statusCode == 200) {
        const $ = cheerio.load(html)

        const siteHeading = $('.xpc')

        console.log(siteHeading.text())
    }
})
