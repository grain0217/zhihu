const AnswerModel = require('../models/answer')
const mongoose = require('mongoose')

class AnswerCtl {
  // 指定问题下的答案
  async list (ctx) {
    const { pageNo = 1, pageSize = 10 } = ctx.query
    const skip = (pageNo - 1) * pageSize
    const reg = new RegExp(ctx.query.q)
    const answers = await AnswerModel
      .find({ content: reg, question: ctx.params.questionId })
      .limit(+pageSize).skip(skip)
    ctx.body = {
      status: 200,
      data: answers,
    }
  }

  // 寻找特定答案
  async queryById (ctx) {
    const { fields = '' } = ctx.query
    const selectedFields = fields.split(';').filter(f => f).map(f => `+${f}`).join('')
    const answer = await AnswerModel.findById(ctx.params.id).select(selectedFields).populate('answerer')

    ctx.body = {
      status: 200,
      data: answer
    }
  }

  // 创建答案
  async create (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
    })
    const answer = await new AnswerModel({
      ...ctx.request.body,
      answerer: ctx.state.user._id,
      question: ctx.params.questionId
    }).save()
    ctx.body = {
      status: 200,
      data: answer
    }
  }

  async update (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
    })
    await AnswerModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = {
      status: 200
    }
  }

  async delete (ctx) {
    await AnswerModel.findOneAndDelete(ctx.params.id)
    ctx.body = {
      status: 200
    }
  }

  async checkExist (ctx, next) {
    const isValid = mongoose.Types.ObjectId.isValid(ctx.params.id)
    if (!isValid) ctx.throw(404, '答案不存在')
    const answer = await AnswerModel.findById(ctx.params.id)
    if (!answer) ctx.throw(404, '答案不存在')
    // 只有在删改查答案时 才检查此逻辑，赞、踩时不检查
    if (ctx.params.questionId && answer.question.toString() !== ctx.params.questionId) ctx.throw(404, '答案不存在')
    await next()
  }

  // 检查调用 update接口的用户是否为回答者?????没看懂 ctx.state.anwser是什么东西？？？
  async checkAnswer (ctx, next) {
    const { answer } = ctx.state
    if (answer.toString() !== ctx.state.user._id) ctx.throw(403, '没有权限')
    await next()
  }
}



module.exports = new AnswerCtl()