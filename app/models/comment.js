const mongoose = require('mongoose')
const { schema } = require('./user')

const { Schema, model } = mongoose

const commentSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true },
  commentator: { type: Schema.Types.ObjectId, ref: 'User' },
  question: { type: Schema.Types.ObjectId, required: true, select: false },
  answer: { type: Schema.Types.ObjectId, required: true, select: false },
  // 只有二级评论才有
  rootCommentId: { type: Schema.Types.ObjectId },
  replyTo: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

module.exports = model('Comment', commentSchema)
