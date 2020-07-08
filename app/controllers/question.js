const QuestionModel = require('../models/question')
const mongoose = require('mongoose')

class QuestionCtl {
  async list (ctx) {
    const { pageNo = 1, pageSize = 10 } = ctx.query
    const skip = (pageNo - 1) * pageSize
    const reg = new RegExp(ctx.query.q)
    const questions = await QuestionModel
      // $or
      .find({ $or: [{ title: reg }, { description: reg }] })
      .limit(+pageSize).skip(skip)
    ctx.body = {
      status: 200,
      data: questions,
    }
  }

  async queryById (ctx) {
    const { fields = '' } = ctx.query
    const selectedFields = fields.split(';').filter(f => f).map(f => `+${f}`).join('')
    const question = await QuestionModel.findById(ctx.params.id).select(selectedFields).populate('questioner topic')

    ctx.body = {
      status: 200,
      data: question
    }
  }

  async create (ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: true }
    })
    const question = await new QuestionModel({
      ...ctx.request.body,
      questioner: ctx.state.user._id
    }).save()
    ctx.body = {
      status: 200,
      data: question
    }
  }

  async update (ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false }
    })
    await QuestionModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = {
      status: 200,
    }
  }

  async delete (ctx) {
    await QuestionModel.findByIdAndDelete(ctx.params.id)
    ctx.body = { stauts: 200 }
  }

  async checkExist (ctx, next) {
    const isValid = mongoose.Types.ObjectId.isValid(ctx.params.id)
    if (!isValid) ctx.trow(404, '问题不存在')
    const question = QuestionModel.findById(ctx.params.id)
    if (!question) ctx.trow(404, '问题不存在')
    await next()
  }

  async checkQuestioner (ctx, next) {
    const question = await QuestionModel.findById(ctx.params.id)
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
}

module.exports = new QuestionCtl()
