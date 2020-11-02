const cheerio = require('cheerio')
const request = require('request')
const yargs = require('yargs')

const url = 'https://www.google.com/search?q='

const arguments = yargs.argv

let lyrics = (arguments._).join('')

if (process.argv.length <= 2){
    console.log("Please pass Song Name which you want to find lyrics of!")
}

const fetchURL = `${url}${lyrics} lyrics`

request(fetchURL, (error, response, html) => {
    if(!error & response.statusCode == 200) {
        const $ = cheerio.load(html)

        const siteHeading = $('.xpc')

        console.log(siteHeading.text())
    }
})
