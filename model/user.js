const mongoose = require('../utils/dbhandler')

/**
 * 参数1： 需要链接的表名（mongoose会自动将这个表加一个s）
 * 参数2： 字段的类型对象（配置项）
 */
const User = mongoose.model('user', {
  username: String,
  password: String,
  isLogin: Boolean
})

// 查找
const findUser = (userInfo, callback) => {
  User.findOne(userInfo).then((err, res) => {
    if (err) {
      callback(err)
    } else {
      callback(res)
    }
  })
}

// 添加
const insertUser = (userInfo, callback) => {
  let user = new User({
    username: userInfo.username,
    password: userInfo.password,
    isLogin: false
  })
  user.save().then((err, res) => {
    if (err) {
      callback(err)
    } else {
      callback(res)
    }
  })
}

module.exports = {
  findUser,
  insertUser
}