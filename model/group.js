const mongoose = require('../utils/dbhandler')
const userModel = require('./user')

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
        userModel.findUser({userName: data.creator}, user => {
            let group = {
                id: id,        // 班级id,
                creator: data.creator,        // 创建者id
                recent_members: [user],         // 成员数组
                createTimestamp: time,    // 创建时间戳
                updateTimestamp: time,    // 更新时间戳
                name: data.name,           // 班级名字
            }
            new Group(group).save().then(res => {
                callback(group)
            }).catch(err => callback({error: err}))
        })
    })
}

// 根据id查询对应班级信息
const getGroup = (id, callback) => {
    Group.findOne(id, {_id: 0}).then(group => {
        let res = group.toObject()
        delete res.__v
        callback(res)
    }).catch(err => callback({error: err}))
}

// 根据userName查询所有创建的班级
const getCreateGroups = (userName, callback) => {
    Group.find({creator: userName}).then(list => callback(list))
    .catch(err => callback({error: err}))
}

const addMember = (data, callback) => {
    userModel.findUser({userName: data.MemberID}, user => {
        Group.updateOne({id: data.id}, {
            $push: { recent_members: user },
            updateTimestamp: new Date().getTime()
        }).then(res =>{
            callback(res)
        }).catch(err => callback({error: err}))
    })
}

const removeGroup = (id, callback) => {
    Group.deleteOne(id).then(res => callback(res))
    .catch(err => callback({error: err}))
}

module.exports = {
    createGroup,
    getGroup,
    getCreateGroups,
    addMember,
    removeGroup
}