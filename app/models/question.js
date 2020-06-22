const mongoose = require('mongoose')

const { Schema, model } = mongoose

const questionSchema = new Schema({
  __v: { type: Number, select: false },
  title: { type: String, required: true },
  description: { type: String, select: false, required: true },
  questioner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answerers: [
    { type: Schema.Types.ObjectId, ref: 'User' }
  ]
})

module.exports = model('Question', questionSchema)