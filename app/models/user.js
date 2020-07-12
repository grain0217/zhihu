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
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male',
    required: true,
    select: false
  },

  // 一句话介绍
  headline: { type: String },

  // 居住地
  locations: {
    type:  [{
      type: Schema.Types.ObjectId,
      ref: 'Topic'
    }],
    select: false 
  },

  // 所在行业
  profession: {
    type: Schema.Types.ObjectId,
    ref: 'Topic'
  },

  // 职业经历
  careerExperience: {
    type: [
      {
        company: {
          type: Schema.Types.ObjectId,
          ref: 'Topic'
        },
        job: {
          type: Schema.Types.ObjectId,
          ref: 'Topic'
        }
      }
    ],
    select: false
  },

  // 教育经历
  educationExperience: {
    type: [
      {
        school: {
          type: Schema.Types.ObjectId,
          ref: 'Topic'
        },
        major: {
          type: Schema.Types.ObjectId,
          ref: 'Topic'
        },
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
        startTime: { type: Number },
        endTime: { type: Number }
      }
    ],
    select: false
  },

  // 个人简介
  profile: { type: String, select: false },

  // 关注的知乎er
  following: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    select: false
  },

  // 关注的话题
  followingTopics: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Topic'
    }],
    select: false,
  },

  // 赞过的答案
  likingAnswers: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Answer',
    }],
    select: false
  },

  // 踩过的答案
  dislikingAnswers: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Answer',
    }],
    select: false
  }
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