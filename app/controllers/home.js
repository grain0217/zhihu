class Home {
  index (ctx) {
    ctx.body = '<h1>这里是主页</h1>'
  }
}

module.exports = new Home()
