const formModel = require('../model/form')
const tools = require('../utils/tools')

const getFormList = (req, res) => {
    let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    if (!userName) {
        res.json({
            code: -1,
            msg: '用户未登录'
        })
    }

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
    let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    if (!userName) {
        res.json({
            code: -1,
            msg: '用户未登录'
        })
    }

    let {Name, Questions, ExtraSubmitterInfos} = req.body
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

const deleteForm = (req, res) => {
    let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    if (!userName) {
        res.json({
            code: -1,
            msg: '用户未登录'
        })
    }

    let {FormID} = req.body
    formModel.deleteForm({FormID}, (deleteRes) => {
        if (!deleteRes) {
            res.json({
                code: -1,
                msg: '作业已不存在'
            })
        } else {
            res.json({
                code: 1,
                msg: '成功'
            })
        }
    })
}

const copyForm = (req, res) => {
    let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    if (!userName) {
        res.json({
            code: -1,
            msg: '用户未登录'
        })
    }

    let {FormID} = req.body
    formModel.copyForm({FormID}, (copyRes) => {
        if (!copyRes.FormID) {
            res.json({
                code: -1,
                msg: '复制失败'
            })
        } else {
            res.json({
                code: 1,
                msg: '成功'
            })
        }
    })
}

const saveForm = (req, res) => {
    let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    if (!userName) {
        res.json({
            code: -1,
            msg: '用户未登录'
        })
    }

    let {FormID, ...update} = req.body
    update.Questions && (update.Questions = eval(update.Questions))
    update.ExtraSubmitterInfos && (update.ExtraSubmitterInfos = eval(update.ExtraSubmitterInfos))

    formModel.saveForm({FormID}, {...update}, (updateRes) => {
        if (!updateRes) {
            res.json({
                code: -1,
                msg: '更新失败'
            })
        } else {
            res.json({
                code: 1,
                msg: '成功',
                data: updateRes
            })
        }
    })
}

const publishForm = (req, res) => {
    let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    if (!userName) {
        res.json({
            code: -1,
            msg: '用户未登录'
        })
    }
    let {FormID, ExpireTimestamp} = req.body
    formModel.publishForm({userName, FormID, ExpireTimestamp}, (updateRes) => {
        if (!updateRes) {
            res.json({
                code: -1,
                msg: '发布失败'
            })
        } else {
            res.json({
                code: 1,
                msg: '成功'
            })
        }
    })
}

module.exports = {
    getFormList,
    createForm,
    deleteForm,
    copyForm,
    saveForm,
    publishForm
}