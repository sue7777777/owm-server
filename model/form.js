const mongoose = require('../utils/dbhandler')

const Form = mongoose.model('form', {
    CreateTime: Number,         // 创建的时间戳 ms
    CreaterID: String,          // 创建者id
    Direction: String,          // 来源-保留字段
    ExpireTimestamp: Number,    // 过期时间戳 ms
    ExtraSubmitterInfos: Array,// 额外的提交者信息-保留字段
    FormID: Number,             // 作业id
    IsReplied: Boolean,         // 是否有人回复
    Name: String,               // 作业标题
    OwnerID: String,            // 用户id
    PublishTimestamp: Number,   // 发布时间戳 ms
    Questions: Array,           // 问题数组
    Status: String,             // 作业状态(published-已发布,draft-草稿)
    Type: String,               // 作业类型-保留字段
    UpdateTime: Number,         // 更新时间戳(创建为草稿后更新) ms
    UpdaterID: String           // 更新者id(目前只有创建者有更新权限)
})

function getNewFormId () {
    return new Promise((resolve, reject) => {
        Form.find().then((res) => {
            // 获取最后一份作业的id 在此基础上+1
            let lastForm = res[res.length - 1]
            let id = lastForm.toObject().FormID
            resolve(id + 1)
        }).catch((err) => {
            reject(err)
        })
    })
}

// 根据用户id获取作业list (CreateID)
const getFormList = (CreateID, callback) => {
    Form.find(CreateID, { _id:0 }).then((res) => {
        // 过滤 __v
        callback(res.map((form) => {
            form = form.toObject()
            delete form.__v
            return form
        }))
    }).catch((err) => {
        callback(err)
    })
}

// 查找对应id作业
const findForm = (FromID, callback) => {
    Form.findOne(FromID).then((res) => {
        callback(res)
    }).catch((err) => {
        callback(err)
    })
}

// 创建作业
const createForm = (formInfo, callback) => {
    getNewFormId().then((res) => {
        let time = new Date().getTime()
        let data = {
            CreateTime: time,
            CreaterID: formInfo.userName,
            ExtraSubmitterInfos: formInfo.ExtraSubmitterInfos,
            FormID: res,
            Name: formInfo.Name,
            OwnerID: formInfo.userName,
            Questions: formInfo.Questions,
            Status: "draft",
            Type: "assignment_form",
            UpdateTime: time,
            UpdaterID: formInfo.userName,
        }
        let form = new Form(data)
        form.save().then((res) => {
            if(res){
                callback(data)
            }
        }).catch((err) => {
            callback(err)
        })  
    }).catch((err) => callback(err))
}

// 删除作业
const deleteForm = (FormID, callback) => {
    Form.findOneAndDelete(FormID).then((res) => {
        callback(res)
    }).catch((err) => {
        callback(err)
    })
}

// 更新作业问题
const saveForm = (FormID, update, callback) => {
    Form.updateOne(FormID, update).then((res) => {
        Form.findOne(FormID, {_id: 0}).then((form) => {
            form = form.toObject()
            delete form.__v
            callback(form)
        }).catch((err) => callback(err))
    }).catch((err) => {
        callback(err)
    })
}

// 复制作业
const copyForm = (FormID, callback) => {
    Form.findOne(FormID, {_id: 0}).then((res) => {
        let form = res.toObject()
        delete form.__v
        getNewFormId().then((res) => {
            form.FormID = res
            form.Status = 'draft'
            console.log(form)
            new Form(form).save().then((res) => {
                if (res) {
                    callback(form)
                }
            }).catch((err) => callback(err))
        }).catch((err) => callback(err))
    }).catch((err) => callback(err))
}

// 发布作业
const publishForm = (updateInfo, callback) => {
    let update = {
        ExpireTimestamp : updateInfo.ExpireTimestamp,
        Status: 'published',
        UpdaterID: updateInfo.userName
    }
    Form.updateOne({FormID:updateInfo.FormID}, update)
    .then((res) => callback(res))
    .catch((err) => callback(err))
}

module.exports = {
    findForm,
    getFormList,
    createForm,
    deleteForm,
    saveForm,
    copyForm,
    publishForm
}