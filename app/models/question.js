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
  // answerers: {
  //   type: [{
  //     type: Schema.Types.ObjectId,
  //     ref: 'User'
  //   }],
  //   select: false
  // },
  topic: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Topic'
    }],
    select: false
  }
})

module.exports = model('Question', questionSchema)