const transationModel = require('../model/transation')
const tools = require('../utils/tools')

const getTransations = (req, res) => {
    let {formId,status, limit, skip} = req.query
    
    // 暂时写死
    let query = {FormID: formId, neStatus: 'unsubmitted'}
    transationModel.getTransations(query, (list) => {
        if (!list) {
            res.json({
                code: -1,
                msg: '参数错误'
            })
        } else {
            let pageList = list
            if (limit && limit > 0) {
                // 分页
                pageList = tools.Page(list, limit, skip)
            }
            res.json({
                code: 1,
                msg: 'SUCCESS',
                data: {
                    List: pageList,
                    Total: list.length
                }
            })
        }
    })
}

const getTransationNumber = (req, res) => {
    let {FormID} = req.query
    transationModel.getTransationsNumber(FormID, (TransationNum) => {
        if (!TransationNum) {
            res.json({
                code: -1,
                msg: '参数错误'
            })
        } else {
            res.json({
                code: 1,
                msg: 'SUCCESS',
                data: TransationNum
            })
        }
    })
}

const createTransation = (req, res) => {
    let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    if (!userName) {
        res.json({
            code: -1,
            msg: 'NO_LOGIN'
        })
    }

    let {FormID} = req.query
    transationModel.createTransation({FormID, userName}, (data) => {
        if (data) {
            res.json({
                code: 1,
                msg: 'SUCCESS',
                data: data
            })
        } else {
            res.json({
                code: -1,
                msg: '作业不存在'
            })
        }
    })
}

const updateTransation = (req, res) => {
    let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    if (!userName) {
        res.json({
            code: -1,
            msg: 'NO_LOGIN'
        })
    }

    let {FormID, TransationID, data} = req.body
    transationModel.updateTransation({FormID, TransationID, data}, updateRes => {
        if (updateRes.error) {
            res.json({
                code: -1,
                msg: 'FAILED',
                data: updateRes.msg || ''
            })
        } else {
            res.json({
                code: 1,
                msg: 'SUCCESS',
                data: ''
            })
        }
    })
}

module.exports = {
    getTransations,
    getTransationNumber,
    createTransation,
    updateTransation
}
