class Home {
  index (ctx) {
    ctx.body = '<h1>这里是主页</h1>'
  }

  upload (ctx) {
    const file = ctx.request.files.file
    ctx.body = {
      path: file.path
    }
  }
}

module.exports = new Home()
