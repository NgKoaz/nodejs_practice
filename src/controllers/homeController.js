const homeView = require('../models/homeView')
const UserModel = require('../models/user')
const conPool = require('../services/SqlConnection')

const getHomePage = async (req, res) => {
    try {
        // const [result, fields] = await conPool.query("SELECT * FROM `users`")
        const result = await UserModel.find({})
        res.render("home", homeView({ userList: result }))
    } catch (err) {
        res.render("home", homeView({}))
        console.log(err)
    }
}

module.exports = { getHomePage }