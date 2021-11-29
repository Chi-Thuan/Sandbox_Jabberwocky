var express = require('express')
const swaggerUI = require('swagger-ui-express')
const swaggerJSDocs = require('./swagger.json')
const routerIndex = require('./routes/index')
require('dotenv').config()
const app = express()

app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJSDocs))
app.use('/', routerIndex)

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`);
})