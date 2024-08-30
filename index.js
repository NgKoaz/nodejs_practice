require('dotenv').config()
const cors = require('cors')
const path = require('path')
const express = require('express')
const app = express()

const getRouter = require('./src/routes/getRouter')
const postRouter = require('./src/routes/postRouter')

const PORT = 8888

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")))


app.use("/", getRouter)
app.use("/", postRouter)


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})
