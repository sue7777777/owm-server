const mongoose = require('../utils/dbhandler')
const tools = require('../utils/tools')

const File = mongoose.model('image', {
    name: String,       // 文件名
    type: String,       // 文件类型
    data: String | Object,      // 文件
    id: String,         // 分配的id
})

const uploadFile = (data, callback) => {
    let newFile = new File({
        name: data.name,
        type: data.type,
        data: data.data,
        id: tools.toMD5(`${data.userName}+${new Date().getTime()}`)
    })
    newFile.save().then(res => {
        callback({id: newFile.id})
    }).catch(err => callback({error: err}))
}

const getFile = (id, callback) => {
    File.findOne(id, {_id: 0}).then(res => {
        let file = res.toObject()
        delete file.__v
        callback(file)
    }).catch(err => callback({error: err}))
}

module.exports = {
    getFile,
    uploadFile
}