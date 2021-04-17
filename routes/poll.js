const express = require('express')
const router = express.Router()

let gender = new Map()
gender['male'] = 10
gender['female'] = 4

router.get('/',(req, res)=>{
    res.render('Poll/index')
})

router.get('/:gender', (req, res)=>{
    let genderName = req.params.gender
    if(genderName == "male"){
        gender['male'] +=1
    }
    if(genderName == "female"){
        gender['female'] +=1
    }
    res.json({
        gender
    })
})

module.exports = router