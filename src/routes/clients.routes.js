const { GET_CLIENT , REGISTER_CLIENT , EDIT_CLIENT , DELETE_CLIENT } = require('../global/_var.js')

// Dependencies
const express = require('express')
const router = express.Router()

// Controllers
const dataController = require('../controllers/getInfo.controller.js')
const saveController = require('../controllers/saveInfo.controller.js')

// Routes
router.get(GET_CLIENT , dataController.getClients)

router.post(REGISTER_CLIENT , saveController.regClient)

router.post(EDIT_CLIENT , saveController.editClient)

router.post(DELETE_CLIENT , saveController.deleteClient)

module.exports = router
