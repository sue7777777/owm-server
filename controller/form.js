const formModel = require('../model/form')

const getFormList = (req, res) => {
    let {userName} = req.query

    formModel.getFormList({ CreaterID: userName }, (list) => {
        if (!list) {
            res.json({
                code: -1,
                msg: '用户不存在'
            })
        } else {
            res.json({
                code: 1,
                msg: '成功',
                data: {
                    List: list,
                    Total: list.length
                }
            })
        }
    })
}

const createForm = (req, res) => {
    let {userName, Name, Questions, ExtraSubmitterInfos} = req.body
    Questions = eval(Questions)
    ExtraSubmitterInfos = eval(ExtraSubmitterInfos)
    formModel.createForm({userName, Name, Questions, ExtraSubmitterInfos}, (createRes) => {
        if (!createRes.FormID) {
            res.json({
                code: -1,
                msg: '创建失败！'
            })
        } else {
            res.json({
                code: 1,
                msg: '成功',
                data: createRes
            })
        }
    })
}

module.exports = {
    getFormList,
    createForm
}