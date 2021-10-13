//Setup external project dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const path = require('path')

// app.use('/', express.static(path.resolve(__dirname, 'routes')))



//Use Express JS to parse JSON data
app.use(express.json())

//Get dotenv setup for .env file
require('dotenv').config()

//Get Mongoose Connection Going
mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true},
    () =>
    console.log('connected to DB')
    );

//Setup db stuff
const db = mongoose.connection
db.on('error', (error) => console.log(error));

//Setting up our book route
const booksRouter = require('./routes/books')

//Middleware
app.use('/books', booksRouter)


//Setting up Swagger Stuff
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Bookstore API',
            version: '1.0.0',
            description: 'Bookstore API design.'
        },
    servers: [
        {
            url: 'http://localhost:3000'
        },
    ],

    },
    apis: ['./routes/books.js'],
}

const swaggerDocs = swaggerJSDoc(swaggerOptions)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))







//Get the server to run in a particular port
app.listen(3000, () => {
    console.log("server started");
});



