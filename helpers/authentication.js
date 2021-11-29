var createHmac = require('create-hmac')
require('dotenv').config()

const checkSecurity = (req, res, next) => {
    const sign = req.headers['authorization'] ? req.headers["authorization"].split(' ')[1] : '';
    if (sign === '') {
        res.status(403).json({ message: "Forbidden" });
    } else {
        const apiKey = req.headers["x-api-key"];
        const callDate = req.headers["x-date"];
        const body = JSON.stringify(req.body);
        const method = req.method;
        const url = req.originalUrl;
        const message = method === "POST" ? method + callDate + url + body : method + callDate + url;
        const HmacKey = process.env.SECRET;;
        const signed = createHmac("sha512", HmacKey).update(message).digest('hex').toLowerCase();

        if (sign != signed) {
            res.status(401).json({ message: "Forbidden" });
        } else {
            const date1 = new Date(callDate);
            const date2 = new Date();

            const diff = date2 - date1;

            if (diff > 300000) {
                res.status(401).json({ message: "To old request" });
            } else {
                next();
            }
        }
    }
}

module.exports = { checkSecurity }