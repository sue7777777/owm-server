var express = require('express');
var router = express.Router();

var userController = require('../controller/user')
var formController = require('../controller/form')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// user
router.post('/user/login', userController.login)
router.post('/user/register', userController.register)
router.post('/user/forgetPassword', userController.changePwdWithUserNumber)
router.get('/user/getUserInfo', userController.getUserInfo)

// form
router.get('/form/getFormList', formController.getFormList)
router.post('/form/createForm', formController.createForm)

module.exports = router;
