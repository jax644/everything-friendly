const express = require('express');
const puppeteer = require('puppeteer');
const RecipeClipper = require('@julianpoy/recipe-clipper')

const app = express()
const PORT = 3000

app.use(express.json())



app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})