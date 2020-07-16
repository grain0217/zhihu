const mongoose = require('mongoose')

const commentModel = require('../models/comment')

class CommentCtl {
  // 答案下的评论
  async list (ctx) {
    const { pageNo = 1, pageSize = 10 } = ctx.query
    const skip = (pageNo - 1) * pageSize
    const comments = await commentModel
      .find({ question: ctx.params.questionId, answer: ctx.params.answerId })
      .limit(+pageSize).skip(skip)
      .populate('commentator')
      
    ctx.body = {
      status: 200,
      data: comments
    }
  }

  // 查找特定评论
  async queryById (ctx) {
    const { fields = '' } = ctx.query
    const selectedFileds = fields.split(';').filter(f => f).map(f => `+${f}`).join('')
    const comments = await commentModel.findById(ctx.params.id).select(selectedFileds).populate('commentator')

    ctx.body = {
      status: 200,
      data: comments
    }
  }

  // 创建评论
  async create (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    const commentator = ctx.state.user._id
    const { questionId, answerId } = ctx.params
    await new commentModel({
      ...ctx.request.body,
      commentator,
      question: questionId,
      answer: answerId
    }).save()
    ctx.body = {
      status: 200
    }
  }

  // 删除评论
  async delete (ctx) {
    await commentModel.findOneAndDelete(ctx.params.id)
    ctx.body = {
      status: 200
    }
  }

  // 回复评论
  // todo
  
  // 检查评论是否存在
  async checkExist (ctx, next) {
    const { questionId, questionId, id} = ctx.params
    const isValid = mongoose.Types.ObjectId.isValid(questionId) && mongoose.Types.ObjectId.isValid(questionId) && mongoose.Types.ObjectId(id)
    if (!isValid) ctx.throw(404, 'id非法')
    const comment = await commentModel.findById(id).select('+question+answer')
    if (!comment) ctx.throw(404, '无此评论')
    if (comment.question.toString() !== questionId) ctx.throw(404, '问题下无此评论')
    if (comment.answer.toString() !== answerId) ctx.throw(404, '答案下无此评论')
    await next()
  }

  // 检查删除评论的是否是评论人本人
  async checkCommentator (ctx, next) {
    const comment = await commentModel.findById(ctx.params.id)
    const commmenator = ctx.state.user._id
    if (comment.commentator.toString() !== commmenator) ctx.throw(403, '你无权操作此评论')
    await next()
  }
}

module.exports = new CommentCtl()
