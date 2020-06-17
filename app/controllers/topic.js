const TopicModel = require('../models/topic')

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
    const topic = await TopicModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = {
      status: 200,
    }
  }
}

module.exports = new TopicCtl()
