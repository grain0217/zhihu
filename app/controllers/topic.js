const TopicModel = require('../models/topic')
const UserModel = require('../models/user')
const QuestionModel = require('../models/question')

const mongoose = require('mongoose');

class TopicCtl {
  async list (ctx) {
    const { pageNo = 1, pageSize = 10 } = ctx.query
    const skip = (pageNo - 1) * pageSize
    const topics = await TopicModel
      .find({ name: new RegExp(ctx.query.q) })
      .limit(+pageSize).skip(skip)
    ctx.body = {
      status: 200,
      data: topics,
      // paging: {
      //   total,
      //   hasMore: true,
      //   pageNo,
      //   pageSize
      // }
    }
  }

  async queryById (ctx) {
    const { fields = '' } = ctx.query
    const selectedFields = fields.split(';').filter(f => f).map(f => `+${f}`).join('')

    const topic = await TopicModel.findById(ctx.params.id).select(selectedFields)
    ctx.body = {
      status: 200,
      data: topic
    }
  }

  async create (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const topic = new TopicModel(ctx.request.body).save()
    ctx.body = {
      status: 200,
      data: topic
    }
  }

  async update (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    await TopicModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = {
      status: 200,
    }
  }

  async follow (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+followingTopics')
    if (!me.followingTopics.map(t => t.toString()).includes(ctx.params.id)) {
      me.followingTopics.push(ctx.params.id)
      me.save()
    }
    ctx.body = {
      status: 200,
    }
  }

  async unfollow (ctx) {
    const user = await UserModel.findById(ctx.state.user._id).select('+followingTopics')
    const index = user.followingTopics.indexOf(ctx.params.id)
    if (index > -1) {
      user.followingTopics.splice(index, 1)
      user.save()
    }
    ctx.body = {
      status: 200
    }
  }

  // 话题关注者
  async followers (ctx) {
    const followers = await UserModel.find({ followingTopics: ctx.params.id })
    ctx.body = {
      status: 200,
      data: followers
    }
  }

  // 话题下的问题
  async questions (ctx) {
    const questions = await QuestionModel.find({ topic: ctx.params.id })
    ctx.body = {
      status: 200,
      data: questions
    }
  }

  async checkTopicExist (ctx, next) {
    const isValid = mongoose.Types.ObjectId.isValid(ctx.params.id)
    if (!isValid) {
      ctx.throw(404, '话题不存在')
    }
    const topic = await TopicModel.findById(ctx.params.id)
    if (!topic) {
      ctx.throw(404, '话题不存在~')
    }
    await next()
  }
}

module.exports = new TopicCtl()
