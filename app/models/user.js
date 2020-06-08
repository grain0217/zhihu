const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  // 覆盖版本
  __v: {
    type: Number,
    select: false,
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    // 查询隐藏密码
    select: false,
  }
}, 
// 禁用文档版本，设置无效？？
// {
//   versionKey: false
// }
)

module.exports = model('User', userSchema)
 