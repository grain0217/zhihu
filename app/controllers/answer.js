const AnswerModel = require('../models/answer')
const mongoose = require('mongoose')

class AnswerCtl {
  // 指定问题下的答案
  async list (ctx) {
    const { pageNo = 1, pageSize = 10 } = ctx.query
    const skip = (pageNo - 1) * pageSize
    const reg = new RegExp(ctx.query.q)
    const answers = await AnswerModel
      .find({ content: reg, question: ctx.params.id })
      .limit(+pageSize).skip(skip)
    ctx.body = {
      status: 200,
      data: answers,
    }
  }

  async queryById (ctx) {
    const { fields = '' } = ctx.query
    const selectedFields = fields.split(';').filter(f => f).map(f => `+${f}`).join('')
    const answer = await AnswerModel.findById(ctx.params.id).select(selectedFields).populate('answerer')

    ctx.body = {
      status: 200,
      data: answer
    }
  }

  async create (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
    })
    const answer = await new AnswerModel({
      ...ctx.request.body,
      answerer: ctx.state.user._id,
      question: crx.params.id
    }).save()
    ctx.body = {
      status: 200,
      data: answer
    }
  }

  async update (ctx) {
    
  }

  async checkExist (ctx, next) {
    const isValid = mongoose.Types.ObjectId.isValid(ctx.params.id)
    if (!isValid) ctx.throw(404, '答案不存在')
    const answer = await AnswerModel.findById(ctx.params.id)
    if (!answer) ctx.throw(404, '答案不存在')
    // if (answer.question !== )
    await next()
  }
}



module.exports = new AnswerCtl()
``