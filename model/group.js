const mongoose = require('../utils/dbhandler')
// const userModel = require('../model/user')

const Group = mongoose.model('group', {
  id: Number,        // 班级id,
  creator: String,        // 创建者id
  recent_members: Array,         // 成员数组
  createTimestamp: Number,    // 创建时间戳
  updateTimestamp: Number,    // 更新时间戳
  name: String,           // 班级名字
})

function getNewGrorpId () {
  return new Promise((resolve, reject) => {
    Group.find().then((res) => {
      let lastGroup, id
      // 获取最后一份作业的id 在此基础上+1
      if(res.length > 0) {
          lastGroup = res[res.length - 1]
          id = lastGroup.toObject().id
      } else {
          id = 0
      }
      resolve(id + 1)
    }).catch((err) => {
      reject({error: err})
    })
  })
}

const createGroup = (data, callback) => {
  let time = new Date().getTime()
  getNewGrorpId().then(id => {
    let group = {
      id: id,        // 班级id,
      creator: data.creatorID,        // 创建者id
      recent_members: [data.creator],         // 成员数组
      createTimestamp: time,    // 创建时间戳
      updateTimestamp: time,    // 更新时间戳
      name: data.name,           // 班级名字
    }
    new Group(group).save().then(res => {
      callback(group)
    }).catch(err => callback({error: err}))
  })
}

// 根据id查询对应班级信息
const getGroup = (id, callback) => {
  Group.findOne(id, {_id: 0}).then(group => {
    if (group) {
      let res = group.toObject()
      delete res.__v
      callback(res)
    } else {
      callback({error: 'NO_RESULT'})
    }
  }).catch(err => callback({error: err}))
}

// 根据userName查询所有创建的班级
const getCreateGroups = (userName, callback) => {
  Group.find({creator: unescape(userName)}).then(list => callback(list))
  .catch(err => callback({error: err}))
}

// 将用户加入指定group
const addMember = (data, callback) => {
  Group.updateOne({id: data.id}, {
    $push: { recent_members: data.Member },
    updateTimestamp: new Date().getTime()
  }).then(res =>{
    callback(res)
  }).catch(err => callback({error: err}))
}

// 从指定group中移除指定用户
const removeMember = (data, callback) => {
  console.log(unescape(data.MemberID), data.id)
  Group.updateOne({id: data.id}, {
    $pull: {recent_members: {userName: unescape(data.MemberID)}},
    updateTimestamp: new Date().getTime()
  }).then(res => callback(res)).catch(err => callback({error: err}))
}

const removeGroup = (id, callback) => {
  Group.deleteOne(id).then(res => callback(res))
  .catch(err => callback({error: err}))
}

const changeName = (data, callback) => {
  Group.updateOne({id: data.id}, {name: data.name}).then(res => callback(res)).catch(err => callback({error: err}))
}

module.exports = {
  createGroup,
  getGroup,
  getCreateGroups,
  addMember,
  removeMember,
  removeGroup,
  changeName
}