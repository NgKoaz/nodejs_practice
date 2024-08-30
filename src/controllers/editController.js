const editView = require('../models/editView')
const conPool = require('../services/SqlConnection')

const getEditPage = async (req, res) => {
    const id = req.params?.id;
    if (id == null) {
        res.send("id is not found!")
        return;
    }
    try {
        const [result, fields] = await conPool.query("SELECT * FROM `users` WHERE id = ?", [id])
        if (result.length <= 0) {
            res.send("id is not found!")
            return;
        }
        const user = result[0];
        res.render("edit", editView({ id, username: user.username, email: user.email, password: user.password }))
    } catch (err) {
        console.log(err)
        res.send("id is not found!")
    }
}

const postEdit = async (req, res) => {
    const { id, username, email, password } = req.body;

    if (!(username && email && password)) {
        res.send("One of inputs is null");
        return;
    }

    try {
        await conPool.query("UPDATE `users` SET username=?, email=?, password=? WHERE id = ?", [username, email, password, id])
        res.redirect("/")
    } catch (err) {
        res.send("Error in database");
        console.log(err)
    }
}

module.exports = { getEditPage, postEdit }