const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

/**
* @swagger
*   components:
*     schemas:
*       Book:
*         type: object
*         required:
*           - title
*           - isbn13
*           - details
*           - publisher
*           - year
*           - price
*         properties:
*           title:
*             type: string
*             description: The title of the book.
*           isbn13:
*             type: string
*             description: The isbn13 of the book.
*           details:
*             type: string
*             description: The details of the book.
*           publisher:
*             type: string
*             description: The publisher of the book.
*           year:
*             type: number
*             description: The date the book was published.
*           price:
*             type: number
*             description: The price of the book.
*         example:
*            title: The Best Book Ever
*            isbn13: "2348957489354"
*            details: A really, really good book
*            publisher: Good Book Productions
*            year: 2021
*            price: 3.50      
*/


/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API to manage your books.
 *      
 *        
 */


/**
 * @swagger
 *  /books/?apikey={apikey}:
 *    get:
 *      description: Get all the books
 *      tags: [Books]
 *      parameters:
 *        - in: query
 *          name: apikey
 *          schema:
 *            type: string
 *          required: true
 *          description: The api key.
 *      responses:
 *        "200":
 *          description: The list of books.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Book'
 *           
 *      
 *        
 */
router.get('/', async (req, res) => {
    const apikey = req.query.apikey
    if (apikey == 'hK0iP5dL7bW3fP3y'){
        try {
            const books = await Book.find({}, {_id: 0}).sort({"isbn13": 1})
            // Object.keys(books).length
            res.status(200).json({
                total: Object.keys(books).length,
                books
            })
            
        } catch (err) {
            res.status(404).json({message: 'The requested resource was not found'})
        }
    }
    else {
        res.status(401).json({message: 'The request didn’t include an API key, or the key was invalid'})
    }
})


// GET ONE BOOK
/**
 * @swagger
 *  /books/{isbn13}/?apikey={apikey}:
 *    get:
 *      description: Get one of the books
 *      tags: [Books]
 *      parameters:
 *        - in: query
 *          name: apikey
 *          schema:
 *            type: string
 *          required: true
 *          description: The api key.
 *        - in: path
 *          name: isbn13
 *          schema:
 *            type: string
 *          required: true
 *          description: Give the isbn of the book.
 *      responses:
 *        "200":
 *          description: One of the books was given.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Book'
 *           
 *      
 *        
 */
//Get One Book
router.get('/:isbn/', async (req, res) => {
    const apikey = req.query.apikey
    if (apikey == 'hK0iP5dL7bW3fP3y'){

        try {
            const book = await Book.find({isbn13:req.params.isbn}, {_id: 0})
            
            res.status(200).json(book)
    
        } catch (error) {
            res.status(404).json({message: 'The requested resource was not found'})
        }
        
    }

    else {
        res.status(401).json({message: 'The request didn’t include an API key, or the key was invalid'})
    }

})

// ADD BOOK

/**
 * @swagger
 *  /books/?apikey={apikey}:
 *    post:
 *      description: Add a book
 *      tags: [Books]
 *      parameters:
 *        - in: query
 *          name: apikey
 *          schema:
 *            type: string
 *          required: true
 *          description: The api key.
 *      requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Book'
 *      responses:
 *        "200":
 *          description: One book was added.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Book'
 *           
 *      
 *        
 */
// Add one book
router.post('/', async (req, res) => {

    const book = new Book({
        title: req.body.title,
        isbn13: req.body.isbn13,
        details: req.body.details,
        publisher: req.body.publisher,
        year: req.body.year,
        price: req.body.price
    })

    const apikey = req.query.apikey
    if (apikey == 'hK0iP5dL7bW3fP3y'){

        try {
            var isbnNum = req.body.isbn13
            const exists = await Book.exists({isbn13: isbnNum})
            if (exists){
                res.status(404).json({
                    status: 1,
                    message: "Book already exists, use PUT to update"
                })
            }
            else {
                await book.save()
                res.status(200).json({
                    status: 0,
                    message: "Book added"
                })
            }
            
        } catch (error) {
            res.status(404).json({message: 'The requested resource was not found'})
        }

    }
    else {
        res.status(401).json({message: 'The request didn’t include an API key, or the key was invalid'})
    }
})



/**
 * @swagger
 *  /books/{isbn13}/?apikey={apikey}:
 *    put:
 *      description: Get one of the books
 *      tags: [Books]
 *      parameters:
 *        - in: query
 *          name: apikey
 *          schema:
 *            type: string
 *          required: true
 *          description: The api key.
 *        - in: path
 *          name: isbn13
 *          schema:
 *            type: string
 *          required: true
 *          description: Give the isbn of the book.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Book'
 *      responses:
 *        "200":
 *          description: One of the books was given.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Book'
 *           
 *      
 *        
 */
//Update one book
router.put('/:isbn/', async (req, res) => {

    const apikey = req.query.apikey
    if (apikey == 'hK0iP5dL7bW3fP3y'){

        try {
            await Book.updateOne(
                {isbn13: req.params.isbn},
                {$set: {title: req.body.title, details: req.body.details, publisher: req.body.publisher, year: req.body.year, price: req.body.price}}
            )
            res.status(200).json({
                status: 0,
                message: "Book updated"
            })
            
        } catch (error) {
            res.status(404).json({message: 'The requested resource was not found'})
        }

    }
    else {
        res.status(401).json({message: 'The request didn’t include an API key, or the key was invalid'})
    }


})


/**
 * @swagger
 *  /books/{isbn13}/?apikey={apikey}:
 *    delete:
 *      description: Delete one of the books
 *      tags: [Books]
 *      parameters:
 *        - in: query
 *          name: apikey
 *          schema:
 *            type: string
 *          required: true
 *          description: The api key.
 *        - in: path
 *          name: isbn13
 *          schema:
 *            type: string
 *          required: true
 *          description: Give the isbn of the book.
 *      responses:
 *        "200":
 *          description: Delete one of the books.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Book'
 *           
 *      
 *        
 */



// Delete one book
router.delete('/:isbn', async (req, res) => {

    const apikey = req.query.apikey
    if (apikey == 'hK0iP5dL7bW3fP3y'){
        try {
            const deleteBook = await Book.remove({isbn13: req.params.isbn})
            res.status(200).json({
                status: 0,
                message: "Book deleted"
            })
        } catch (error) {
            res.status(404).json({message: 'The requested resource was not found'})
        }
    }
    else{
        res.status(401).json({message: 'The request didn’t include an API key, or the key was invalid'})
    }
})


//405 HTTP Responses

//HEAD
router.head('/:isbn/:apikey', async (req, res) => {
    res.status(405).json({message: 'The HEAD method was not supported by the resource'})
})

//CONNECT
router.connect('/:isbn/:apikey', async (req, res) => {
    res.status(405).json({message: 'The CONNECT method was not supported by the resource'})
})

//OPTIONS
router.options('/:isbn/:apikey', async (req, res) => {
    res.status(405).json({message: 'The OPTIONS method was not supported by the resource'})
})

//TRACE
router.trace('/:isbn/:apikey', async (req, res) => {
    res.status(405).json({message: 'The TRACE method was not supported by the resource'})
})

//PATCH
router.patch('/:isbn/:apikey', async (req, res) => {
    res.status(405).json({message: 'The PATCH method was not supported by the resource'})
})


module.exports = router

// var isbnNum = req.body.isbn13
//         const exists = await Book.exists({isbn13: isbnNum})
//         if (apikey == 'hK0iP5dL7bW3fP3y' && exists){
//             res.status(200).json(book)
//         }
//         if (apikey != 'hK0iP5dL7bW3fP3y') {
//             res.status(401).json({message: 'The request didn’t include an API key, or the key was invalid'})
//         }
//         else {
//             res.status(404).json({message: 'The requested resource was not found'})
