const mongoose = require('mongoose')

const { Schema, model } = mongoose

const commentSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true },
  commentator: { type: Schema.Types.ObjectId, ref: 'User' },
  question: { type: Schema.Types.ObjectId, required: true, select: false },
  answer: { type: Schema.Types.ObjectId, required: true, select: false }
})

module.exports = model('Comment', commentSchema)
