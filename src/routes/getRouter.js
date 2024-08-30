const express = require('express')
const router = express.Router()
const { getHomePage } = require('../controllers/homeController')
const { getCreatePage } = require('../controllers/createController')
const { getEditPage } = require('../controllers/editController')


router.get("/", getHomePage)
router.get("/create", getCreatePage)
router.get("/edit/:id", getEditPage)

module.exports = router;