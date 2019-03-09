const userModel = require('../model/user')

const login  = (req, res) => {
  let {username, password, status} = req.body
  userModel.findUser({username}, (user) => {
    if (!user) {
      res.json({
        code: 1,
        msg: '用户名不存在'
      })
    } else {
      if (user.password == password) {
        res.cookie('user', username)
        res.json({
          code: 0,
          msg: '登录成功！'
        })
      } else {
        res.json({
          code: 2,
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
        code: 3,
        msg: '用户名已存在'
      })
    } else {
      userModel.insertUser({username, password, identify, usernumber} ,(result) => {
        !result? res.json({
          code: 9,
          msg: "error: "+err
        }) : res.json({
          code: 0,
          msg: '注册成功！'
        })
      })
    }
  })
}

module.exports = {
  login,
  register
}