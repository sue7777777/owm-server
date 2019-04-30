const mongoose = require('../utils/dbhandler')
const groupModel = require('../model/group')

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
  groups: Array,      // 学生的任课老师
})

const findUserWithPas = (userInfo, callback) => {
  User.findOne(userInfo, {_id: 0}).then(res => {
    let res2 = res.toObject()
    delete res2.__v
    callback(res2)
  }).catch(err => callback({error: err}))
}

// 查找
const findUser = (userInfo, callback) => {
  User.findOne(userInfo, {_id: 0}).then(res => {
    let res2 = res.toObject()
    delete res2.__v
    // delete res2.password
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

const getTeachers = (data, callback) => {
  User.find({identify: 1}, {_id:0}).then(res => callback(res)).catch(err => callback({error: err}))
}

// 获取用户加入的班级（不包括创建的）
const getMyGroups = (data, callback) => {
  User.findOne({userName: unescape(data.userName)}).then(res => {
    callback(res.groups)
  }).catch(err => callback({error: err}))
}

// 用户加入班级
const addGroup = (data, callback) => {
  User.updateOne({userName: unescape(data.userName), identify: 2}, {$addToSet: {groups: data.GroupID} }).then(res => {
    User.find({userName: unescape(data.userName)}).then(user => {
      // 为group添加成员
      groupModel.addMember({Member: user, id:  data.GroupID}, updateRes => {
        if (updateRes.error) {
          callback({error: updateRes.error})
        } else {
          callback(res)
        }
      })
    }).catch(err => callback({error: err}))
  }).catch(err => callback({error: err}))
}

// 用户退出班级
const quitGroup = (data, callback) => {
  User.updateOne({userName: unescape(data.userName), identify: 2}, {$pull: {groups: data.GroupID}}).then(res => {
    // 将用户移出group
    groupModel.removeMember({id: data.GroupID, MemberID: data.userName}, updateRes => {
      if (updateRes.error) {
        callback({error: updateRes.error})
      } else {
        callback(res)
      }
    })
  }).catch(err => callback({error: err}))
}

module.exports = {
  findUser,
  findUserWithPas,
  insertUser,
  changeUserPwd,
  getTeachers,
  getMyGroups,
  addGroup,
  quitGroup
}