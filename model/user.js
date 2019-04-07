const mongoose = require('../utils/dbhandler')

/**
 * 参数1： 需要链接的表名（mongoose会自动将这个表加一个s）
 * 参数2： 字段的类型对象（配置项）
 */
const User = mongoose.model('user', {
  userName: String,   // 用户名
  password: String,   // 密码
  identify: Number,   // 身份： 1-老师， 2-学生
  usernumber: String, // 用户唯一标识，老师是职工号，学生是学号
  avatar: String      // 头像图片
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
    userName: userInfo.userName,
    password: userInfo.password,
    identify: userInfo.identify,
    usernumber: userInfo.usernumber,
    avatar: userInfo.avatar
  })
  user.save().then((err, res) => {
    if (err) {
      callback(err)
    } else {
      callback(res)
    }
  })
}

// 修改密码
const changeUserPwd = (userInfo, callback) => {
  User.updateOne({userName: userInfo.userName}, {password: userInfo.newPassword}).then((err, res) => {
    if (err) {
      callback(err)
    } else {
      callback(res)
    }
  })
}

module.exports = {
  findUser,
  insertUser,
  changeUserPwd
}