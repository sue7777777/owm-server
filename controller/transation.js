const transationModel = require('../model/transation')
const tools = require('../utils/tools')

const getTransation  = (req, res) => {
  let {TransationID} = req.query

  transationModel.getTransation(TransationID, result => {
    if (result.error) {
      res.json({
        code: -1,
        msg: result.error || 'FAILED',
      })
    } else {
      res.json({
        code: 1,
        msg: 'SUCCESS',
        data: result
      })
    }
  })
}

const getTransations = (req, res) => {
    let {formId,status, limit, skip} = req.query
    
    // 暂时写死
    let query = {FormID: formId, neStatus: 'unsubmitted'}
    transationModel.getTransations(query, (list) => {
      if (!list) {
        res.json({
          code: -1,
          msg: 'FAILED'
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
        msg: 'FAILED'
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
  data.Answers && (data.Answers = eval(data.Answers))
  data.AnswerComments && (data.AnswerComments = eval(data.AnswerComments))
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

const getStatistic = (req, res) => {
  let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
  if (!userName) {
    res.json({
      code: -1,
      msg: 'NO_LOGIN'
    })
  }

  let {FormID} = req.query
  transationModel.getStatistic({FormID}, stat => {
    if (stat.error) {
      res.json({
        code: -1,
        msg: 'FAILED',
        error: stat.error
      })
    } else {
      res.json({
        code: 1,
        msg: 'SUCCESS',
        data: stat
      })
    }
  })
}

const getQuestionIndexResponseList = (req, res) => {
  let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
  if (!userName) {
    res.json({
      code: -1,
      msg: 'NO_LOGIN'
    })
  }

  let {FormID, QuestionIndex} = req.query
  transationModel.getQuestionIndexResponseList({FormID, QuestionIndex}, queryRes => {
    if (queryRes.error) {
      res.json({
        code: -1,
        msg: 'FAILED',
        error: queryRes
      })
    } else {
      res.json({
        code: 1,
        msg: 'SUCCESS',
        data: queryRes
      })
    }
  })
}

const getMyTransations = (req, res) => {
  let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
  if (!userName) {
    res.json({
      code: -1,
      msg: 'NO_LOGIN'
    })
  }

  transationModel.getMyTransations({userName: userName}, queryRes => {
    if (queryRes.error) {
      res.json({
        code: -1,
        msg: 'FAILED',
        error: queryRes.error
      })
    } else {
      res.json({
        code: 1,
        msg: 'SUCCESS',
        data: queryRes
      })
    }
  })
}

const deleteTransation = (req, res) => {
  let {id} = req.query
  let userName = tools.Cookie.get(req.headers.cookie, 'owm_id')
  if (!userName) {
    res.json({
      code: -1,
      msg: 'NO_LOGIN'
    })
  }

  transationModel.deleteTransation({id: id}, deleteRes => {
    if (deleteRes.error) {
      res.json({
        code: -1,
        msg: 'FAILED',
        error: deleteRes
      })
    } else {
      res.json({
        code: 1,
        msg: 'SUCCESS',
        data: deleteRes
      })
    }
  })
}

module.exports = {
  getTransation,
  getTransations,
  getStatistic,
  getMyTransations,
  getTransationNumber,
  getQuestionIndexResponseList,
  createTransation,
  updateTransation,
  deleteTransation
}
