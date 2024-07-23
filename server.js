require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI
const Note = require('./models/note')

mongoose.connect(MONGO_URI)

mongoose.connection.once('open', () => {
    console.log('MongoDB is showing love')
})

mongoose.connection.on('error', () => {
    console.error('You know how MongoDB be trippin')
})

// controller & router logic

// Create
app.post('/notes', async (req, res) => {
    try {
        const createdNote = await Note.create(req.body)
        res.json(createdNote)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})