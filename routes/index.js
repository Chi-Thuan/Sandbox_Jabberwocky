const express = require('express')
const router = express.Router()
var { checkSecurity } = require('../helpers/authentication')
var createHmac = require('create-hmac')
require('dotenv').config()

router.get('/', checkSecurity, (req, res) => {
    const body = JSON.stringify(req.body);
    console.log(body);
    console.log(req.method);
    console.log(req.originalUrl);
    res.send({ 'message': 'Hello World! Method GET' });
})

router.post('/post', checkSecurity, (req, res) => {
    res.send({ 'message': 'Hello World! Method POST' })
})

router.delete('/delete', checkSecurity, (req, res) => {
    res.send({ 'message': 'Hello World! Method DELETE' })
})

router.post('/generate-token-method-post', async (req, res) => {

    const xDate = new Date().toISOString();
    const apiKey = process.env.KEY;
    const url = "/post";
    const message = "POST" + xDate + url + JSON.stringify(req.body);
    const HmacKey = process.env.SECRET;
    const signed = createHmac("sha512", HmacKey).update(message).digest('hex').toLowerCase();

    res.status(200).send({ 
        x_api_key : apiKey,
        x_date : xDate,
        token : signed
    })
})

router.get('/generate-token-method-get/:params', async (req, res) => {
    const { params } = req.params
    const xDate = new Date().toISOString();
    const apiKey = process.env.KEY;
    const message = "GET" + xDate + params;
    const HmacKey = process.env.SECRET;
    const signed = createHmac("sha512", HmacKey).update(message).digest('hex').toLowerCase();

    res.status(200).send({ 
        x_api_key : apiKey,
        x_date : xDate,
        token : signed
    })
})

module.exports = router