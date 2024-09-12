require('dotenv').config()
const cors = require('cors')
const path = require('path')
const express = require('express')
const app = express()

const getRouter = require('./src/routes/getRouter')
const postRouter = require('./src/routes/postRouter')
const apiRoutes = require("./src/routes/apiRoutes")
const customerRouter = require("./src/routes/customerApi")
const fileUpload = require("express-fileupload")
const projectRouter = require('./src/routes/projectApi')
const userRouter = require('./src/routes/userApi')


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")))


app.use("/", getRouter)
app.use("/", postRouter)
app.use("/v1/api", apiRoutes)
app.use("/v1/api", customerRouter)
app.use("/v1/api", projectRouter)
app.use("/v1/api", userRouter)


app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`)
})
