const formModel = require('../model/form')
const tools = require('../utils/tools')

const getForm = (req, res) => {
    let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    if (!userName) {
        res.json({
            code: -1,
            msg: '用户未登录'
        })
    } 

    let {FormID} = req.query
    formModel.findForm({FormID}, (form) => {
        if (form.error) {
            res.json({
                code: -1,
                msg: '作业不存在'
            })
        } else {
            res.json({
                code: 1,
                msg: '成功',
                data: form
            })
        }
    })
}

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

// 通过index更新问题内容
const updateQuestions = (req, res) => {
    let {type, FormID, index, data} = req.body
    if(type === 'insert') {
        formModel.insertQuestion({FormID, data: JSON.parse(data)}, (insertRes) => {
            if (insertRes.error) {
                res.json({
                    code: -1,
                    msg: '失败'
                })
            } else {
                res.json({
                    code: 1,
                    msg: '成功',
                    data: 'success'
                })
            }
        })
    } else {
        formModel.updateQuestion({FormID, index, data: JSON.parse(data)}, updateRes => {
            if (updateRes.error) {
                res.json({
                    code: -1,
                    msg: '失败'
                })
            } else {
                res.json({
                    code: 1,
                    msg: '成功',
                    data: 'success'
                })
            }
        })
    }
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

const getSearchList = (req,res) => {
    let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    if (!userName) {
        res.json({
            code: -1,
            msg: '用户未登录'
        })
    }

    let {skip, limit, namekeyword} = req.query
    formModel.findFormByName({userName, Name: namekeyword}, (queryRes) => {
        if(queryRes.error) {
            res.json({
                code: -1,
                msg: '失败'
            })
        } else {
            let list = queryRes
            if(limit && limit > 0) {
                list = tools.Page(queryRes, limit, skip)
            }
            res.json({
                code: 1,
                msg: '成功',
                data: {
                    List: list,
                    Total: queryRes.length
                }
            })
        }
    })
}

module.exports = {
    getForm,
    getFormList,
    getSearchList,
    createForm,
    deleteForm,
    copyForm,
    saveForm,
    publishForm,
    updateQuestions
}