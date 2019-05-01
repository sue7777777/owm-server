const express = require('express');
const router = express.Router();

const userController = require('../controller/user')
const formController = require('../controller/form')
const transationController = require('../controller/transation')
const fileController = require('../controller/file')
const groupController = require('../controller/group')
const specialController = require('../controller/special')

// user
router.post('/user/login', userController.login)
router.post('/user/register', userController.register)
router.post('/user/forgetPassword', userController.changePwdWithUserNumber)
router.get('/user/getUserInfo', userController.getUserInfo)
router.get('/user/getTeachers', userController.getTeachers)
router.get('/user/addGroup', userController.addGroup)
router.get('/user/quitGroup', userController.quitGroup)
router.get('/user/getMyGroups', userController.getMyGroups)

// form
router.get('/form/getForm', formController.getForm)
router.get('/form/getFormList', formController.getFormList)
router.get('/form/getSearchList', formController.getSearchList)
router.get('/form/getGroupFormList', formController.getGroupFormList)
router.post('/form/createForm', formController.createForm)
router.post('/form/deleteForm', formController.deleteForm)
router.post('/form/copyForm', formController.copyForm)
router.post('/form/saveForm', formController.saveForm)
router.post('/form/publishForm', formController.publishForm)
router.post('/form/updateQuestions', formController.updateQuestions)
router.get('/form/getUserFormList', formController.getUserFormList)
router.get('/form/getFormByID', formController.getFormByID)

// transation
router.get('/transation/getTransation', transationController.getTransation)
router.get('/transation/getTransations', transationController.getTransations)
router.get('/transation/getTransationNumber', transationController.getTransationNumber)
router.get('/transation/createTransation', transationController.createTransation)
router.post('/transation/updateTransation', transationController.updateTransation)
router.get('/transation/getStatistic', transationController.getStatistic)
router.get('/transation/getQuestionIndexResponseList', transationController.getQuestionIndexResponseList)
router.get('/transation/getMyTransations', transationController.getMyTransations)

// file
router.get('/file/getFile', fileController.getFile)
router.post('/file/uploadFile', fileController.uploadFile)

// group
router.post('/group/createGroup', groupController.createGroup)
router.get('/group/getGroup', groupController.getGroup)
router.get('/group/getCreateGroups', groupController.getCreateGroups)
router.get('/group/removeGroup', groupController.removeGroup)
router.get('/group/changeName', groupController.changeName)

// special
router.get('/special/getSpecials', specialController.getSpecials)
router.post('/special/addSpecial', specialController.addSpecial)

module.exports = router;
