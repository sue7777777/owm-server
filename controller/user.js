const userModel = require('../model/user')

const login  = (req, res) => {
  let {username, password, status} = req.body
  userModel.findUser({username}, (user) => {
    if (!user) {
      res.json({
        code: -1,
        msg: '用户名不存在'
      })
    } else {
      if (user.password == password) {
        res.cookie('user', username)
        res.json({
          code: 1,
          msg: '登录成功！'
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
  let {username, password, identify, usernumber} = req.body
  // 检查是否用户名已存在
  userModel.findUser({username}, (user) => {
    if (user) {
      res.json({
        code: -1,
        msg: '用户名已存在'
      })
    } else {
      userModel.insertUser({username, password, identify, usernumber} ,(result) => {
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
  let { username, usernumber, newPassword } = req.body
  console.log(req.body)
  // 检查用户名和学号是否匹配
  userModel.findUser({username}, (user) => {
    console.log(user)
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
        userModel.changeUserPwd({username, newPassword}, (result) => {
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

module.exports = {
  login,
  register,
  changePwdWithUserNumber
}