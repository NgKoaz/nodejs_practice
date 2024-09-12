require('dotenv').config()
const mysql = require('mysql2/promise')
const mongoose = require('mongoose')

const env = process.env;

// const conPool = mysql.createPool({
//     host: env.DB_HOST,
//     port: env.DB_PORT,
//     database: env.DB_DATABASE_NAME,
//     user: env.DB_USER,
//     password: env.DB_PASSWORD
// })
(async () => {
    const url = `mongodb+srv://${env.DB_HOST_NOSQL}/?retryWrites=true&w=majority&appName=Cluster0`
    try {
        await mongoose.connect(url, {
            dbName: env.DB_DATABASE_NAME_NOSQL,
            user: env.DB_USER_NOSQL,
            pass: env.DB_PASSWORD_NOSQL
        })
        console.log(`Connected to database named ${env.DB_DATABASE_NAME_NOSQL}`)
    } catch (err) {
        console.log(err)
    }
})()



module.exports = mongoose;