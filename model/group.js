const mongoose = require('../utils/dbhandler')

const Group = mongoose.model('group', {
    GroupID: Number,        // 班级id,
    CreatorID: String,        // 创建者id
    MemberIDs: Array,         // 成员数组
    CreateTimestamp: Number,    // 创建时间戳
    UpdateTimestamp: Number,    // 更新时间戳
    Name: String,           // 班级名字
})

function getNewGrorpId () {
    return new Promise((resolve, reject) => {
        Group.find().then((res) => {
            let lastGroup, id
            // 获取最后一份作业的id 在此基础上+1
            if(res.length > 0) {
                lastGroup = res[res.length - 1]
                id = lastGroup.toObject().GroupID
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
            GroupID: id,        // 班级id,
            CreatorID: data.CreatorID,        // 创建者id
            MemberIDs: [data.CreatorID],         // 成员数组
            CreateTimestamp: time,    // 创建时间戳
            UpdateTimestamp: time,    // 更新时间戳
            Name: data.Name,           // 班级名字
        }
        new Group(group).save().then(res => {
            callback(group)
        }).catch(err => callback({error: err}))
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
    Group.find({CreatorID: userName}).then(list => callback(list))
    .catch(err => callback({error: err}))
}

const addMember = (data, callback) => {
    Group.updateOne({GroupID: data.GroupID}, {
        $push: { MemberIDs: data.MemberID },
        UpdateTimestamp: new Date().getTime()
    }).then(res =>{
        callback(res)
    }).catch(err => callback({error: err}))
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