const jwt = require('jsonwebtoken')

const mongoose = require('mongoose');

const UserModel = require('../models/user')
const QuestionModel = require('../models/question')
const AnswerModel = require('../models/answer')

const { privateKey } = require('../config');

class UserCtl {
  // 用户列表
  async list (ctx) {
    const { pageSize = 10, pageNo = 1 } = ctx.query
    const skip = (pageNo - 1) * pageSize
    const users = await UserModel
      .find({ name: new RegExp(ctx.query.q) })
      .limit(+pageSize).skip(skip)
    ctx.body = {
      status: 200,
      data: users
    }
  }

  // 查询具体用户
  async queryById (ctx) {
    const { fields = '' } = ctx.query
    const selectedFields = fields.split(';').filter(f => f).map(f => ` +${f}`).join('')

    const populateStr = fields.split(';').filter(f => f).map(f => {
      if (f === 'careerExperience') {
        return 'careerExperience.company careerExperience.job'
      } else if (f === 'educationExperience') {
        return 'educationExperience.school educationExperience.major educationExperience.diploma'
      } else {
        return f
      }
    }).join(' ')

    // select 追加隐藏字段
    const user = await UserModel.findById(ctx.params.id)
      .select(selectedFields)
      .populate(populateStr)
    ctx.body = {
      status: 200,
      data: user
    }
  }

  // 注册用户
  async create (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const { name } = ctx.request.body
    const existUser = await UserModel.findOne({ name })
    if (existUser) ctx.throw(409, '用户名已存在')

    // 密码加密待处理
    const user = await new UserModel(ctx.request.body).save()
    ctx.body = user
  }

  async delete (ctx) {
    await UserModel.findByIdAndRemove(ctx.params.id)
    ctx.body = {
      success: true,
      msg: '删除成功'
    }
  }

  async update (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string' },
      gender: { type: 'string' },
      headline: { type: 'string' },
      locations: { type: 'array', itemType: 'string' },
      profession: { type: 'string' },
      careerExperience: { type: 'array', itemType: 'object' },
      educationExperience: { type: 'array', item: 'object' },
      profile: { type: 'string' }
    })
    const user = await UserModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = {
      status: 200,
      data: user
    }
  }
  
  async login (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    // 密码明文存储？
    const user = await UserModel.findOne(ctx.request.body)
    if (!user) ctx.throw(401, '用户名或密码不正确')

    const { _id, name } = user
    const token = jwt.sign({
      _id, name
    }, privateKey, {
      expiresIn: '30d'
    })
    ctx.body = { token }
  }

  // 授权
  async checkOwner (ctx, next) {
    // 权限限制
    if (ctx.params.id !== ctx.state.user._id) {}
    await next()
  }

  // 关注的知乎er列表
  // ref + populate 填充查询
  async followingList (ctx) {
    const user = await UserModel.findById(ctx.params.id).populate('following')
    ctx.body = {
      status: 200,
      data: user.following
    }
  }

  // 粉丝列表
  async followerList (ctx) {
    const users = await UserModel.find({ following: ctx.params.id })
    ctx.body = {
      status: 200,
      data: users
    }
  }

  // 关注的话题列表
  async followingTopicList (ctx) {
    const user = await UserModel.findById(ctx.params.id).populate('followingTopics')
    ctx.body = {
      status: 200,
      data: user.followingTopics
    }
  }

  async likingAnswerList (ctx) {
    const user = await UserModel.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers')
    ctx.body = {
      status: 200,
      data: user.likingAnswers
    }
  }

  // 添加关注
  async follow (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+following')
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.body = {
      status: 200,
    }
  }

  // 点赞答案
  async like (ctx, next) {
    const me = await UserModel.findById(ctx.state.user._id).select('+likingAnswers')
    if (!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.likingAnswers.push(ctx.params.id)
      me.save()
      // 点赞数自增1
      await AnswerModel.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: 1 }})
    }
    await next()
    ctx.body = {
      status: 200,
    }
  }

  // 取消点赞答案
  async cancelLike (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+likingAnswers')
    const index = me.likingAnswerList.map(l => l.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.likingAnswerList.splice(index, 1)
      me.save()
      // 点赞数自增-1
      await AnswerModel.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: -1 }})
    }
    ctx.body = {
      status: 200,
    }
  }
  
  async disLikingAnswerList (ctx) {
    const user = await UserModel.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers')
    ctx.body = {
      status: 200,
      data: user.dislikingAnswers
    }
  }

  // 踩答案
  async dislike (ctx, next) {
    const me = await UserModel.findById(ctx.state.user._id).select('+dislikingAnswers')
    if (!me.dislikingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.dislikingAnswers.push(ctx.params.id)
      me.save()
    }
    await next()
    ctx.body = {
      status: 200,
    }
  }

  // 取消踩答案
  async cancelDislike (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+dislikingAnswers')
    const index = me.likingAnswerList.map(l => l.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.dislikingAnswers.splice(index, 1)
      me.save()
    }
    ctx.body = {
      status: 200,
    }
  }


  // 用户的提问
  async listQuestion (ctx) {
    const questions = await QuestionModel.find({ questioner: ctx.params.id })
    ctx.body = {
      status: 200,
      data: questions
    }
  }

  // 取消关注
  async unfollow (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+following')
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.body = { status: 200 }
  }

  async checkUserExist (ctx, next) {
    const isValid = mongoose.Types.ObjectId.isValid(ctx.params.id)
    if (!isValid) ctx.throw(404, '用户不存在')
    const user = await UserModel.findById(ctx.params.id)
    if (!user) ctx.throw(404, '用户不存在')
    await next()
  }
}

module.exports = new UserCtl()
