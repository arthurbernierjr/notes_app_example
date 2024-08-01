require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI
const PORT = 3000
const Note = require('./models/note')
const logger = require('morgan')
const methodOverride = require('method-override')

app.use(express.json()) // we are able to parse the body and accept json data from requestors
app.use(express.urlencoded({ extended: true })) // we are able to parse the body and accept urlencoded data which is default form data
app.use(logger('tiny'))
app.use(methodOverride('_method'))
app.use('/assets', express.static('public'))


mongoose.connect(MONGO_URI)

mongoose.connection.once('open', () => {
    console.log('MongoDB is showing love')
})

mongoose.connection.on('error', () => {
    console.error('You know how MongoDB be trippin')
})

// controller & router logic

/**********************************
 * ******************************
 * ******************************
 * CREATE FUNCTIONALITY START
 * ******************************
 * ******************************
 */

// Create
// app.post('/notes', async (req, res) => {
//     try {
//         const createdNote = await Note.create(req.body)
//         res.json(createdNote)
//     } catch (error) {
//         res.status(400).json({ msg: error.message })
//     }
// })
app.post('/notes', async (req, res) => {
    console.log(req.body.hasOwnProperty('text'))
    req.body.isRead === 'on' || req.body.isRead === true? 
    req.body.isRead = true : 
    req.body.isRead = false
    try {
        const createdNote = await Note.create(req.body)
        res.redirect(`/notes/${createdNote._id}`)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

app.get('/notes/new', (req, res) => {
    res.render('new.ejs')
})

/**********************************
 * ******************************
 * ******************************
 * CREATE FUNCTIONALITY END
 * ******************************
 * ******************************
 */


/**********************************
 * ******************************
 * ******************************
 * READ FUNCTIONALITY START
 * ******************************
 * ******************************
 */
// Index and Show
// app.get('/notes', async (req, res) => {
//     try {
//         const foundNotes = await Note.find({})
//         res.json(foundNotes)
//     } catch (error) {
//         res.status(400).json({ msg: error.message })
//     }
// })

app.get('/notes', async(req, res) => {
    try {
        const foundNotes = await Note.find({})
        res.render('index.ejs', {
            notes: foundNotes
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

// app.get('/notes/:id', async (req, res) => {
//     try {
//         const foundNote = await Note.findOne({ _id: req.params.id })
//         res.json(foundNote)
//     } catch (error) {
//         res.status(400).json({ msg: error.message })
//     }
// })

app.get('/notes/:id', async (req, res) => {
    try {
        const foundNote = await Note.findOne({ _id: req.params.id })
        res.render('show.ejs', {
            note: foundNote
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

/**********************************
 * ******************************
 * ******************************
 * READ FUNCTIONALITY END
 * ******************************
 * ******************************
 */

/**********************************
 * ******************************
 * ******************************
 * UPDATE FUNCTIONALITY START
 * ******************************
 * ******************************
 */

// Update
// app.put('/notes/:id', async (req, res) => {
//     try {
//         const updatedNote = await Note.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
//         res.json(updatedNote)
//     } catch (error) {
//         res.status(400).json({ msg: error.message })
//     }
// })

app.put('/notes/:id', async (req, res) => {
    req.body.isRead === 'on' || req.body.isRead === true? 
    req.body.isRead = true : 
    req.body.isRead = false
    try {
        const updatedNote = await Note.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.redirect(`/notes/${updatedNote._id}`)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

app.get('/notes/:id/edit', async (req, res) => {
    try {
        const foundNote = await Note.findOne({ _id: req.params.id })
        res.render('edit.ejs', {
            note: foundNote
        })
    } catch (error) {
        res.status(400).json({ msg: error.message }) 
    }
})
/**********************************
 * ******************************
 * ******************************
 * UPDATE FUNCTIONALITY END
 * ******************************
 * ******************************
 */


/**********************************
 * ******************************
 * ******************************
 * DELETE FUNCTIONALITY START
 * ******************************
 * ******************************
 */
// Delete
// app.delete('/notes/:id', async (req, res) => {
//     try {
//         await Note.findOneAndDelete({ _id: req.params.id })
//         .then((note) => {
//            res.sendStatus(204)
//         })
//     } catch (error) {
//         res.status(400).json({ msg: error.message })
//     }
// })

app.delete('/notes/:id', async (req, res) => {
    try {
        await Note.findOneAndDelete({ _id: req.params.id })
        .then((note) => {
           res.redirect('/notes')
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})
/**********************************
 * ******************************
 * ******************************
 * DELETE FUNCTIONALITY END
 * ******************************
 * ******************************
 */



app.listen(PORT, () => {
    console.log('We in the building' + ` application excepting requests on PORT ${PORT}`)
})