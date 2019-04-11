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
            let pageList = []
            if (limit && limit > 0) {
                console.log('page')
                // 分页
                pageList = tools.Page(list, limit, skip)
            }
            res.json({
                code: 1,
                msg: '成功',
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
    transationModel.getTransationsNumber({FormID}, (TransationNum) => {
        if (!TransationNum) {
            res.json({
                code: -1,
                msg: '参数错误'
            })
        } else {
            res.json({
                code: 1,
                msg: '成功',
                data: TransationNum
            })
        }
    })
}

const createTransation = (req, res) => {
    let {FormID, userName} = req.query
    transationModel.createTransation({FormID, userName}, (data) => {
        if (data) {
            res.json({
                code: 1,
                msg: '成功',
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

module.exports = {
    getTransations,
    getTransationNumber,
    createTransation
}
