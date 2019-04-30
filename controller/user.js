const userModel = require('../model/user')
const tools = require('../utils/tools')

const login  = (req, res) => {
  let {userName, password} = req.body
  userModel.findUserWithPas({userName}, (user) => {
    if (user.error) {
      res.json({
        code: -1,
        msg: '用户名不存在'
      })
    } else {
      if (user.password == password) {
        delete user.password
        res.json({
          code: 1,
          msg: 'SUCCESS',
          result: user
        })
      } else {
        res.json({
          code: -1,
          msg: '密码错误'
        })
      }
    }
  })
}

const register = (req, res) => {
  let {userName, password, identify, usernumber, avatar} = req.body
  // 检查是否用户名已存在
  userModel.findUser({userName}, (user) => {
    if (user) {
      res.json({
        code: -1,
        msg: '用户名已存在'
      })
    } else {
      userModel.insertUser({userName, password, identify, usernumber, avatar} ,(result) => {
        !result? res.json({
          code: -1,
          msg: "error: "+err
        }) : res.json({
          code: 1,
          msg: 'SUCCESS'
        })
      })
    }
  })
}

const changePwdWithUserNumber = (req, res) => {
  let { userName, usernumber, newPassword } = req.body
  // 检查用户名和学号是否匹配
  userModel.findUser({userName}, (user) => {
    if (!user) {
      res.json({
        code: -1,
        msg: '用户名不存在'
      })
    } else {
      if(user.usernumber !== usernumber) {
        res.json({
          code: -1,
          msg: '职工号或学号不匹配'
        })
      } else {
        userModel.changeUserPwd({userName, newPassword}, (result) => {
          !result? res.json({
            code: -1,
            msg: "error: "+err
          }) : res.json({
            code: 1,
            msg: 'SUCCESS'
          })
        })
      }
    }
  })
}

const getUserInfo = (req, res) => {
  let {userName} = req.query

  userModel.findUser({ userName: unescape(userName) }, (user) => {
    if (user.error) {
      res.json({
        code: -1,
        msg: '用户不存在'
      })
    } else {
      res.json({
        code: 1,
        msg: 'SUCCESS',
        result: user
      })
    }
  })
}

const getTeachers = (req, res) => {
  let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
  if (!userName) {
      res.json({
          code: -1,
          msg: 'NO_LOGIN'
      })
  }

  userModel.getTeachers({}, teachers => {
    if (teachers.error) {
      res.json({
        code: -1,
        msg: 'FAILED',
        error: teachers.error
      })
    } else {
      res.json({
        code: 1,
        msg: "SUCCESS",
        list: teachers
      })
    }
  })
}

const addGroup = (req, res) => {
  let {GroupID} = req.query
  let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
  if (!userName) {
      res.json({
          code: -1,
          msg: 'NO_LOGIN'
      })
  }

  userModel.addGroup({GroupID: GroupID, userName: unescape(userName)}, addRes => {
    console.log(addRes)
    if (addRes.error) {
      res.json({
        code: -1,
        msg: 'FAILED',
        error: addRes.error
      })
    } else {
      res.json({
        code: 1,
        msg: 'SUCCESS',
        data: addRes
      })
    }
  })
}

const quitGroup = (req, res) => {
  let {GroupID} = req.query
  let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
  if (!userName) {
      res.json({
          code: -1,
          msg: 'NO_LOGIN'
      })
  }
  userModel.quitGroup({userName: userName, GroupID: GroupID}, updateRes => {
    if (updateRes.error) {
      res.json({
        code: -1,
        msg: 'FAILED',
        error: updateRes.error
      })
    } else {
      res.json({
        code: 1,
        msg: 'SUCCESS',
        data: updateRes
      })
    }
  })
}

const getMyGroups = (req, res) => {
  let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
  if (!userName) {
      res.json({
          code: -1,
          msg: 'NO_LOGIN'
      })
  }
  userModel.getMyGroups({userName: userName}, list => {
    if (list.error) {
      res.json({
        code: -1,
        msg: 'FAILED',
        error: list.error
      })
    } else {
      res.json({
        code: 1,
        msg: 'SUCCESS',
        data: list
      })
    }
  })
}

module.exports = {
  login,
  register,
  changePwdWithUserNumber,
  getUserInfo,
  getTeachers,
  addGroup,
  quitGroup,
  getMyGroups
}