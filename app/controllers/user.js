const UserModel = require('../models/user')

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

  async create (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      age: { type: 'number', required: false }
    })
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
      age: { type: 'number', required: false }
    })
    const user = UserModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }
}

module.exports = new User()
