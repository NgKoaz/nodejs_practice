const express = require('express')
const router = express.Router()
const { postCreate } = require('../controllers/createController')
const { postEdit } = require('../controllers/editController')
const deleteUser = require('../controllers/deleteController')


router.post("/create", postCreate)
router.post("/edit", postEdit)
router.delete("/delete/:id", deleteUser)


module.exports = router;