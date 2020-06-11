const path = require('path')

class Home {
  index (ctx) {
    ctx.body = '<h1>这里是主页</h1>'
  }

  // 上传并返回图片链接
  upload (ctx) {
    const file = ctx.request.files.file
    const basenamde = path.basename(file.path)
    ctx.body = {
      url: `${ctx.origin}/uploads/${basenamde}`
      // path: file.path
    }
  }
}

module.exports = new Home()
