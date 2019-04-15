const FileModel = require('../model/file')

const uploadFile = (req,res) => {
    let {name, data, type, userName} = req.body
    FileModel.uploadFile({name, data, type, userName}, uploadRes => {
        if (uploadRes.error) {
            res.json({
                code: -1,
                msg: 'FAILED'
            })
        } else {
            res.json({
                code: 1,
                msg: 'SUCCESS',
                data: {
                    id: uploadRes.id
                }
            })
        }
    })
}

const getFile = (req, res) => {
    let {id} = req.query
    FileModel.getFile({id}, file => {
        if (file.error) {
            res.json({
                code: -1,
                msg: 'FAILED'
            })
        } else {
            res.json({
                code: 1,
                msg: 'SUCCESS',
                data: file
            })
        }
    })
}

module.exports = {
    getFile,
    uploadFile
}