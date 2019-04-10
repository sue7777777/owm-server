var express = require('express')
var router = express.Router()

var formController = require('../controller/form')

router.get('getFormList', formController.getFormList)

module.exports = router