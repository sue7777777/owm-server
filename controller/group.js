const groupModel = require('../model/group')
const userModel = require('../model/user')
const tools = require('../utils/tools')

const createGroup = (req, res) => {
  let userName = tools.Cookie.get(req.headers.cookie,'owm_id')
  if (!userName) {
    res.json({
      code: -1,
      msg: 'NO_LOGIN'
    })
  }

  let {name} = req.body
  userModel.findUser({userName: userName}, user => {
    if (user.error) {
      res.json({
        code: -1,
        msg: 'FAILED',
        error: user.error
      })
    } else {
      groupModel.createGroup({creator: user, creatorID: userName, name}, createRes=> {
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
  })
  
}

const getGroup = (req, res) => {
    let {id} = req.query
    groupModel.getGroup({id}, group => {
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
    let {userName} = req.query
    if (!userName) {
      userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
      if (!userName) {
          res.json({
              code: -1,
              msg: 'NO_LOGIN'
          })
      }
    }
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

// const addMember = (req, res) => {
//     let {id, MemberID} = req.query
//     groupModel.addMember({id, MemberID}, updateRes => {
//         if (updateRes.error) {
//             res.json({
//                 code: -1,
//                 msg: 'FAILED',
//                 error: updateRes.error
//             })
//         } else {
//             res.json({
//                 code: 1,
//                 msg: 'SUCESS',
//                 data: updateRes
//             })
//         }
//     })
// }

const removeGroup = (req, res) => {
    let {id} = req.query
    groupModel.removeGroup({id}, deleteRes => {
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

const changeName = (req, res) => {
    let {id, name} = req.query
    groupModel.changeName({id: id, name: name}, updateRes => {
        if (updateRes.error) {
            res.json({
                code: -1,
                msg: 'FAILED',
                error: updateRes.error
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

module.exports = {
    createGroup,
    getGroup,
    getCreateGroups,
    // addMember,
    removeGroup,
    changeName
}