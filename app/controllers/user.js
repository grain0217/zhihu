const jwt = require('jsonwebtoken')

const UserModel = require('../models/user')
const { privateKey } = require('../config')

class User {
  async list (ctx) {
    ctx.body = await UserModel.find()
  }

  async query (ctx) {
    const user = await UserModel.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
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
    const user = await UserModel.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    } else {
      ctx.body = {
        success: true,
        msg: '删除成功'
      }
    }
  }

  async update (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await UserModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
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
}

module.exports = new User()
