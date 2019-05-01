const specialModel = require('../model/special')
const tools = require('../utils/tools')

const getSpecials = (req, res) => {
  let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
  if (!userName) {
      res.json({
          code: -1,
          msg: 'NO_LOGIN'
      })
  } else {
    specialModel.getSpecials({userName: userName}, list => {
      if (list.error) {
        res.json({
          code: -1,
          msg: 'FAILED',
          error: list.error
        })
      } else {
        res.json({
          code: 1,
          msg: 'SUCCESS',
          data: list
        })
      }
    })
  }
}

const addSpecial = (req, res) => {
  console.log(req)
  let {type, question} = req.body
  let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
  if (!userName) {
      res.json({
          code: -1,
          msg: 'NO_LOGIN'
      })
  } else {
    specialModel.addSpecial({userName: userName, type: type, question: question}, updateRes => {
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
}

module.exports = {
  getSpecials,
  addSpecial
}