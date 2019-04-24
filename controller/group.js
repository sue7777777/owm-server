const groupModel = require('../model/group')
const tools = require('../utils/tools')

const createGroup = (req, res) => {
    // let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    // if (!userName) {
    //     res.json({
    //         code: -1,
    //         msg: 'NO_LOGIN'
    //     })
    // }

    let {Name, userName} = req.body
    groupModel.createGroup({CreatorID: userName, Name}, createRes => {
        if (createRes.error) {
            res.json({
                code: -1,
                msg: 'FAILED',
                error: createRes.error
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

const getGroup = (req, res) => {
    let {GroupID} = req.query
    groupModel.getGroup({GroupID}, group => {
        if (group.error) {
            res.json({
                code: -1,
                msg: 'FAILED',
                error: group.error
            })
        } else {
            res.json({
                code: 1,
                msg: 'SUCCESS',
                data: group
            })
        }
    })
}

const getCreateGroups = (req, res) => {
    // let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
    // if (!userName) {
    //     res.json({
    //         code: -1,
    //         msg: 'NO_LOGIN'
    //     })
    // }
    let {userName} = req.query
    groupModel.getCreateGroups(userName, list => {
        if (list.error) {
            res.json({
                code: -1,
                msg: 'FAILED',
                error: list.err
            })
        } else {
            res.json({
                code: 1,
                msg: 'SUCCESS',
                list: list
            })
        }
    })
}

const addMember = (req, res) => {
    let {GroupID, MemberID} = req.query
    groupModel.addMember({GroupID, MemberID}, updateRes => {
        if (updateRes.error) {
            res.json({
                code: -1,
                msg: 'FAILED',
                error: updateRes.error
            })
        } else {
            res.json({
                code: 1,
                msg: 'SUCESS',
                data: updateRes
            })
        }
    })
}

const removeGroup = (req, res) => {
    let {GroupID} = req.query
    groupModel.removeGroup({GroupID}, deleteRes => {
        if (deleteRes.error) {
            res.json({
                code: -1,
                msg: 'FAILED',
                error: deleteRes.error
            })
        } else {
            res.json({
                code: 1,
                msg: 'SUCCESS',
                res: deleteRes
            })
        }
    })
}

module.exports = {
    createGroup,
    getGroup,
    getCreateGroups,
    addMember,
    removeGroup
}