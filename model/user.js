const mongoose = require('../utils/dbhandler')

/**
 * 参数1： 需要链接的表名（mongoose会自动将这个表加一个s）
 * 参数2： 字段的类型对象（配置项）
 */
const User = mongoose.model('user', {
  userName: String,   // 用户名，唯一标识
  password: String,   // 密码
  identify: Number,   // 身份： 1-老师， 2-学生
  usernumber: String, // 用户唯一标识，老师是职工号，学生是学号
  avatar: String,     // 头像图片
  teachers: Array,      // 学生的任课老师
})

// 查找
const findUser = (userInfo, callback) => {
  User.findOne(userInfo, {_id: 0}).then(res => {
    let res2 = res.toObject()
    delete res2.__v
    delete res2.password
    callback(res2)
  }).catch(err => callback({error: err}))
}

// 添加
const insertUser = (userInfo, callback) => {
  let user = new User({
    userName: userInfo.userName,
    password: userInfo.password,
    identify: userInfo.identify,
    usernumber: userInfo.usernumber,
    avatar: userInfo.avatar,
    teachers: userInfo.teachers
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
  User.updateOne({userName: unescape(userInfo.userName)}, {password: userInfo.newPassword}).then((err, res) => {
    if (err) {
      callback(err)
    } else {
      callback(res)
    }
  })
}

// 为学生添加任课老师
const addTeachers = (data, callback) => {
  User.updateOne({userName: unescape(data.userName), identify: 2}, {$addToSet: {teachers: data.teachers } }).then(res => callback(res)).catch(err => callback({error: err}))
}

const getTeachers = (data, callback) => {
  User.find({identify: 1}, {_id:0}).then(res => callback(res)).catch(err => callback({error: err}))
}

const removeTeachers = (data, callback) => {
  User.updateOne({userName: unescape(data.userName), identify: 2}, {$pullAll: {teachers: data.teachers}}).then(res => callback(res)).catch(err => callback({error: err}))
}

module.exports = {
  findUser,
  insertUser,
  changeUserPwd,
  addTeachers,
  getTeachers,
  removeTeachers
}