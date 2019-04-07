var express = require('express')
var router = express.Router()

var userController = require('../controller/user')

router.post('/login', userController.login)
router.post('/register', userController.register)
router.post('/forgetPassword', userController.changePwdWithUserNumber)
router.get('/getUserInfo', userController.getUserInfo)

module.exports = router;