const mongoose = require('../utils/dbhandler')

const Special = mongoose.model('special', {
  userName: String,   // 用户名
  type: String,       // 错题和题库
  questions: Array,   // 问题
  updateTimestamp: Number
})

const createSpecial = (data, callback) => {
  let data2 = {
    userName: unescape(data.userName),
    type: data.type,
    questions: [data.question],
    updateTimestamp: new Date().getTime()
  }
  new Special(data2).save().then(res => callback(res)).catch(err => callback({error: err}))
}

const addSpecial = (data, callback) => {
  Special.findOne({userName: unescape(data.userName)}).then(res => {
    if (!res) {
      createSpecial(data, createRes => {
        callback(createRes)
      })
    } else {
      Special.updateOne({userName: unescape(data.userName)}, {
        $addToSet: {questions: data.question}, 
        updateTimestamp: new Date().getTime()
      }).then(res => callback(res)).catch(err => callback({error: err}))
    }
  })
}

const getSpecials = (query, callback) => {
  Special.findOne({userName: unescape(query.userName)}).then(res => callback(res.questions)).catch(err => callback({error: err}))
}

module.exports = {
  createSpecial,
  addSpecial,
  getSpecials
}