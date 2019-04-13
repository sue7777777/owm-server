const formModel = require('../model/form')
const tools = require('../utils/tools')

const getForm = (req, res) => {
    let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    if (!userName) {
        res.json({
            code: -1,
            msg: 'NO_LOGIN'
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
                msg: 'SUCCESS',
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
            msg: 'NO_LOGIN'
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
                msg: 'SUCCESS',
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
            msg: 'NO_LOGIN'
        })
    }

    let {Name, Questions, ExtraSubmitterInfos} = req.body
    Questions = eval(Questions)
    ExtraSubmitterInfos = eval(ExtraSubmitterInfos)
    formModel.createForm({userName, Name, Questions, ExtraSubmitterInfos}, (createRes) => {
        if (!createRes.FormID) {
            res.json({
                code: -1,
                msg: 'FAILED！'
            })
        } else {
            res.json({
                code: 1,
                msg: 'SUCCESS',
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
            msg: 'NO_LOGIN'
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
                msg: 'SUCCESS'
            })
        }
    })
}

const copyForm = (req, res) => {
    let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    if (!userName) {
        res.json({
            code: -1,
            msg: 'NO_LOGIN'
        })
    }

    let {FormID} = req.body
    formModel.copyForm({FormID}, (copyRes) => {
        if (!copyRes.FormID) {
            res.json({
                code: -1,
                msg: 'FAILED'
            })
        } else {
            res.json({
                code: 1,
                msg: 'SUCCESS'
            })
        }
    })
}

const saveForm = (req, res) => {
    let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    if (!userName) {
        res.json({
            code: -1,
            msg: 'NO_LOGIN'
        })
    }

    let {FormID, ...update} = req.body
    update.Questions && (update.Questions = eval(update.Questions))
    update.ExtraSubmitterInfos && (update.ExtraSubmitterInfos = eval(update.ExtraSubmitterInfos))

    formModel.saveForm({FormID}, {...update}, (updateRes) => {
        if (!updateRes) {
            res.json({
                code: -1,
                msg: 'FAILED'
            })
        } else {
            res.json({
                code: 1,
                msg: 'SUCCESS',
                data: updateRes
            })
        }
    })
}

// 通过index更新问题内容
const updateQuestions = (req, res) => {
    let {type, FormID, index, data} = req.body
    if(type === 'insert') {
        formModel.insertQuestion({FormID, data: data}, (insertRes) => {
            if (insertRes.error) {
                res.json({
                    code: -1,
                    msg: 'FAILED'
                })
            } else {
                res.json({
                    code: 1,
                    msg: 'SUCCESS',
                    data: 'SUCCESS'
                })
            }
        })
    } else {
        formModel.updateQuestion({FormID, index, data: data}, updateRes => {
            if (updateRes.error) {
                res.json({
                    code: -1,
                    msg: 'FAILED'
                })
            } else {
                res.json({
                    code: 1,
                    msg: 'SUCCESS',
                    data: 'SUCCESS'
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
            msg: 'NO_LOGIN'
        })
    }
    let {FormID, ExpireTimestamp} = req.body
    formModel.publishForm({userName, FormID, ExpireTimestamp}, (updateRes) => {
        if (!updateRes) {
            res.json({
                code: -1,
                msg: 'FAILED'
            })
        } else {
            res.json({
                code: 1,
                msg: 'SUCCESS'
            })
        }
    })
}

const getSearchList = (req,res) => {
    let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    if (!userName) {
        res.json({
            code: -1,
            msg: 'NO_LOGIN'
        })
    }

    let {skip, limit, namekeyword} = req.query
    formModel.findFormByName({userName, Name: namekeyword}, (queryRes) => {
        if(queryRes.error) {
            res.json({
                code: -1,
                msg: 'FAILED'
            })
        } else {
            let list = queryRes
            if(limit && limit > 0) {
                list = tools.Page(queryRes, limit, skip)
            }
            res.json({
                code: 1,
                msg: 'SUCCESS',
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