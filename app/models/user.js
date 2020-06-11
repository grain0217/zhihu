const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  // 覆盖版本
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: {
    type: String,
    required: true,
    // 查询隐藏密码
    select: false,
  },
  avatar_url: { type: String },
  gender: { type: String, enum: ['male', 'female'], default: 'male', required: true },

  // 一句话介绍
  headline: { type: String },

  // 居住地
  locations: { type: [ { type: String } ] },

  // 所在行业
  profession: { type: String },

  // 职业经历
  careerExperience: {
    type: [
      {
        company: { type: String},
        job: { type: String }
      }
    ]
  },

  // 教育经历
  educationExperience: {
    type: [
      {
        school: { type: String},
        major: { type: String },
        diploma: { type: String },
        startTime: { type: Number },
        endTime: { type: Number }
      }
    ]
  },

  // 个人简介
  profile: { type: String }
}, 
// 禁用文档版本，设置无效？？
// {
//   versionKey: false
// }
)

module.exports = model('User', userSchema)

/*
* schema 模式
* 一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
*/

/*
* model 模型
* 由schema发布生成的模型，具有抽象属性和行为的数据库操作对象
*/

/*
* entity
* 由model创建的实体，它的操作会影响数据库
*/

/*
* schema生成model，model创建entity
*/