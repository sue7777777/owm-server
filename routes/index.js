const express = require('express');
const router = express.Router();

const userController = require('../controller/user')
const formController = require('../controller/form')
const transationController = require('../controller/transation')
const fileController = require('../controller/file')

// user
router.post('/user/login', userController.login)
router.post('/user/register', userController.register)
router.post('/user/forgetPassword', userController.changePwdWithUserNumber)
router.get('/user/getUserInfo', userController.getUserInfo)

// form
router.get('/form/getForm', formController.getForm)
router.get('/form/getFormList', formController.getFormList)
router.get('/form/getSearchList', formController.getSearchList)
router.post('/form/createForm', formController.createForm)
router.post('/form/deleteForm', formController.deleteForm)
router.post('/form/copyForm', formController.copyForm)
router.post('/form/saveForm', formController.saveForm)
router.post('/form/publishForm', formController.publishForm)
router.post('/form/updateQuestions', formController.updateQuestions)

// transation
router.get('/transation/getTransation', transationController.getTransation)
router.get('/transation/getTransations', transationController.getTransations)
router.get('/transation/getTransationNumber', transationController.getTransationNumber)
router.get('/transation/createTransation', transationController.createTransation)
router.post('/transation/updateTransation', transationController.updateTransation)
router.get('/transation/getStatistic', transationController.getStatistic)

// file
router.get('/file/getFile', fileController.getFile)
router.post('/file/uploadFile', fileController.uploadFile)

module.exports = router;
