const express = require('express');
const router = express.Router();

const userController = require('../controller/user')
const formController = require('../controller/form')
const transationController = require('../controller/transation')

// user
router.post('/user/login', userController.login)
router.post('/user/register', userController.register)
router.post('/user/forgetPassword', userController.changePwdWithUserNumber)
router.get('/user/getUserInfo', userController.getUserInfo)

// form
router.get('/form/getFormList', formController.getFormList)
router.get('/form/getSearchList', formController.getSearchList)
router.post('/form/createForm', formController.createForm)
router.post('/form/deleteForm', formController.deleteForm)
router.post('/form/copyForm', formController.copyForm)
router.post('/form/saveForm', formController.saveForm)
router.post('/form/publishForm', formController.publishForm)

// transation
router.get('/transation/getTransations', transationController.getTransations)
router.get('/transation/getTransationNumber', transationController.getTransationNumber)
router.get('/transation/createTransation', transationController.createTransation)

module.exports = router;
