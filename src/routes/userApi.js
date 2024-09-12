const express = require('express')
const router = express.Router()

router
    .route("/users")
    .get((req, res) => { res.send("get") })
    .post((req, res) => { res.send("post") })
    .put((req, res) => { res.send("put") })
    .delete((req, res) => { res.send("delete") })


module.exports = router