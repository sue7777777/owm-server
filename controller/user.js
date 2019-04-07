const userModel = require('../model/user')

const login  = (req, res) => {
  let {userName, password, status} = req.body
  userModel.findUser({userName}, (user) => {
    if (!user) {
      res.json({
        code: -1,
        msg: '用户名不存在'
      })
    } else {
      if (user.password == password) {
        res.cookie('user', userName)
        res.json({
          code: 1,
          msg: '登录成功！',
          result: {
            userName: user.userName,
            identify: user.identify,
            usernumber: user.usernumber,
            avatar: user.avatar
          }
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
          msg: '注册成功！'
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
            msg: '修改成功！'
          })
        })
      }
    }
  })
}

const getUserInfo = (req, res) => {
  // 根据userName获取全部用户信息
  let { userName } = req.query
  userModel.findUser({ userName }, (user) => {
    if (!res) {
      res.json({
        code: -1,
        msg: '用户不存在'
      })
    } else {
      res.json({
        code: 1,
        msg: '成功',
        result: {
          userName: user.userName,
          identify: user.identify,
          usernumber: user.usernumber,
          avatar: user.avatar
        }
      })
    }
  })
}

module.exports = {
  login,
  register,
  changePwdWithUserNumber,
  getUserInfo
}