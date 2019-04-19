const mongoose = require('../utils/dbhandler')
const formModel = require('../model/form')
const _ = require('lodash')

const Transation = mongoose.model('transation', {
    Answers: Array,         // 答案数组
    AnswerComments: Array,  // 批阅内容和得分
    CreateTime: Number,     // 开始答题的时间（创建时间）
    CreaterID: String,      // 这份回复的创建者
    DelivererID: String,    // 发布作业者id（同作业创建者id）-保留字段
    Score: Number,          // 作业得分（submitted只算客观题，reviewed算总分）
    FormID: Number,         // 作业id
    ObjectiveAnswer: Boolean,// 客观题
    ReplyTimestamp: Number, // 结束答题并提交的时间（回复时间）
    Status: String,         // 回复状态(unsubmitted-未回复,submitted-已回复,reviewed-已批阅)
    SubjectiveAnswer: Boolean,// 主观题
    SubmitterID: String,    // 回复者id
    SubmitterUserInfo: Object,// 这份回复的提交者
    TransationID: Number,   // 这份回复的id
    UpdateTime: Number,     // 更新时间(作业批阅时用)
    UpdaterID: String,      // 更新者id
})

function getScore(FormID, Answers) {
    return new Promise((resolve, reject) => {
        formModel.findForm(FormID, form => {
            if (form.error) {
                resolve({error: form.error})
            } else {
                // 从Form查到作业，拿到正确答案
                let questionObj = form.Questions.map(q => {
                    return {
                        score: q.Score,
                        answer: q.StandardAnswer.Contents
                    }
                })
                let answerObj = Answers.map(ans => ans.Contents)
                let score = 0
                for(let i=0 ; i<questionObj.length; i++) {
                    // 主观题的标准答案为空
                    if(questionObj[i].answer.length > 0 && questionObj[i].answer.sort().toString() === answerObj[i].sort().toString()) {
                        score += questionObj[i].score
                    }
                }
                resolve(score)
            }
        })
    })
}

function getStatisticData(questions, transations) {
    let questionObj = questions.map(q => {
        return {
            score: q.Score,
            answer: q.StandardAnswer.Contents
        }
    })
    let answerList = transations.map(ans => {
        return {
            status: ans.Status,
            answer: ans.Answers.map(a => a.Contents),// 每份回复的所有问题的答案
            answerComment: ans.AnswerComments
        }
    })
    console.log(questionObj, answerList)
    let data = []
    for (let i=0; i<questionObj.length; i++) {
        let qaScore = 0, reviewNum = 0, rightNum = 0, optionObj = {}
        for (let j=0; j<answerList.length; j++) {
            // 计算正确人数（客观题）
            if(questionObj[i].answer.length > 0 && questionObj[i].answer.sort().toString() === answerList[j].answer.sort().toString()) {
                rightNum++
            }
            // 已批阅人数
            if(answerList[j].status === 'reviewed') {
                reviewNum++
                // 批阅之后才能得到主观题平均分
                qaScore += answerList[j].answerComment[i].Score
            }
        }

        // 统计各选项人数
        let questionIndexAnswer = _.flatMapDeep(transations, ans => ans.Answers[i].Contents) // 每份回复中第i道题的答案(答案是一个数组，存放了所有选项的答案)，然后拉伸为一维数组
        optionObj = questionIndexAnswer.reduce((prev,next) => { 
            prev[next] = (prev[next] + 1) || 1; 
            return prev; 
        },{})

        let qa = {
            qaScore: qaScore,
            AnswerNumber: answerList.length,    // 回答人数
            AverageScore: qaScore/answerList.length,    // 平均分（主观题）
            OptionNumbers: optionObj,  // 各选项人数
            QuestionIndex: i,   // 问题序号
            ReviewNumber: reviewNum,    // 已批阅人数
            RightNumber: rightNum,     // 正确人数（客观题）
        }
        data.push(qa)
    }
    return data
}

// 根据transationid获取回复
const getTransation = (id, callback) => {
    Transation.findOne({TransationID: id}, {_id: 0}).then(transation => {
        if (transation === null) {
            callback({error: '找不到回复'})
        } else {
            let res = transation.toObject()
            delete res.__v
            formModel.findForm({FormID: res.FormID}, form => {
                if (form.error) {
                    callback({error: form.error})
                } else {
                    callback({
                        Form: form,
                        Transation: res
                    })
                }
            })
        }
    }).catch(err => callback({error: err}))
}

// 根据formid获取作业的回复列表
const getTransations = (queryArr, callback) => {
    Transation.find({FormID: queryArr.FormID, Status: {$ne: queryArr.neStatus}}, {_id: 0}).then((res) => {
        callback(res.map((transation) => {
            transation = transation.toObject()
            delete transation.__v
            return transation
        }))
    }).catch(err => callback({error: err}))
}

const getTransationsNumber = (FormID, callback) => {
    Transation.find({FormID: FormID, Status: {$ne: 'unsubmitted'}}).then((res) => {
        if (res.length > 0){
            callback({
                count: res.length,
                submitterids: res.map((transation) => transation.SubmitterID),
                _id: res.FormID
            })
        } else {
            callback({count: 0})
        }
    }).catch(err => callback(err))
}

// 创建回复（回复时）
const createTransation = (transationInfo, callback) => {
    formModel.findForm({FormID: transationInfo.FormID}, form => {
        if (form) {
            // 创建之前根据用户名查询是否有已经提交的回复
            Transation.findOne({FormID: transationInfo.FormID, SubmitterID: transationInfo.userName}, {_id: 0}).then(transation => {
                if (transation === null) {
                    // 用户未创建回复
                    Transation.countDocuments({}, (err, count) => {
                        if (!err) {
                            let time = new Date().getTime()
                            let data = {
                                CommentScore: false,
                                CreateTime: time,
                                CreaterID: transationInfo.userName,
                                DelivererID: form.CreaterID,
                                FormID: transationInfo.FormID,
                                ObjectiveAnswer: false,
                                Status: "unsubmitted",
                                SubjectiveAnswer: false,
                                SubmitterID: transationInfo.userName,
                                Score: 0,
                                TransationID: count+1,
                                UpdateTime: time,
                                UpdaterID: transationInfo.userName
                            }
                            new Transation(data).save().then(res => callback({
                                Form: form,
                                Transation: data
                            })).catch(err => callback(err))
                        } else callback(err)
                    })
                } else {
                    let res = transation.toObject()
                    delete res.__v
                    callback({
                        Form: form,
                        Transation: res
                    })
                }
            }).catch(err => callback({error: err}))
        } else callback({error})
    })
}

// 更新回复（提交回复、批阅暂存、批阅提交）
const updateTransation = (update, callback) => {
    let {FormID, TransationID, data} = update
    formModel.findForm({FormID}, form => {
        let time = new Date().getTime()
        let expire = form.ExpireTimestamp
        if (time > expire) {
            // 过期的提示已过期
            callback({error: err, msg: 'submit time expired'})
        } else {
            if (data.Answers && !data.Score) {
                // 提交之后计算分数
                getScore({FormID}, data.Answers).then(score => {
                    Transation.updateOne({FormID, TransationID}, {...data, UpdateTime: time, Score: score})
                    .then(res => callback(res))
                    .catch(err => callback({error: err}))
                }).catch(err => callback({error: err}))
            } else {
                // 批阅的话直接得分
                Transation.updateOne({FormID, TransationID}, {...data, UpdateTime: time})
                .then(res => callback(res))
                .catch(err => callback({error: err}))
            }
            
        }
    })
}

const getStatistic = (FormID, callback) => {
    formModel.findForm(FormID, form => {
        if (form.error) {
            callback({error: form.error})
        } else {
            getTransations({...FormID, neStatus: 'unsubmitted'}, transationList => {
                if (transationList.error) {
                    callback({error: transationList.error})
                } else {
                    callback(getStatisticData(form.Questions, transationList))
                }
            })
        }
    })
}

module.exports = {
    getTransation,
    getTransations,
    getTransationsNumber,
    createTransation,
    updateTransation,
    getStatistic
}