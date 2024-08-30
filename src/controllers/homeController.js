const homeView = require('../models/homeView')
const conPool = require('../services/SqlConnection')

const getHomePage = async (req, res) => {
    try {
        const [result, fields] = await conPool.query("SELECT * FROM `users`")
        res.render("home", homeView({ userList: result }))
    } catch (err) {
        res.render("home", homeView({}))
        console.log(err)
    }
}

module.exports = { getHomePage }