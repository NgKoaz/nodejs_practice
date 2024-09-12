const express = require('express')
const router = express.Router()
const { uploadImage, getCustomers, createCustomers, updateCustomer, updateCustomers, deleteCustomers, deleteCustomer } = require('../controllers/customerApi.controller')

router.post("/files", uploadImage)
router.get("/customers", getCustomers)
router.post("/customers", createCustomers)
router.put("/customers/:customerId", updateCustomer)
router.put("/customers", updateCustomers)
router.delete("/customers/", deleteCustomers)
router.delete("/customers/:customerId", deleteCustomer)


module.exports = router;
