const conPool = require("../services/SqlConnection");

const deleteUser = async (req, res) => {
    const id = req.params.id;
    if (id != null) {
        try {
            await conPool.query("DELETE FROM `users` WHERE `users`.`id` = ?", [id])
            res.status(200);
        } catch (err) {
            res.send("Database Error");
            console.log(err)
        }
    }
    res.send("id is not found")
}


module.exports = deleteUser;