const userModel = require('../model/user')

const login  = (req, res) => {
  let {username, password, status} = req.body
  userModel.findUser({username}, (result) => {
    if (!result) {
      res.json({
        code: 200,
        msg: '用户名不存在'
      })
    } else {
      if (result.password == password) {
        res.cookie('user', username)
        res.json({
          code: 200,
          mag: '登录成功！'
        })
      } else {
        res.json({
          code: 200,
          msg: '密码错误'
        })
      }
    }
  })
}

const signUp = (req, res) => {

}

module.exports = {
  login
}