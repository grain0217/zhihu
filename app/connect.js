// connection.js file
const mongoose = require('mongoose');
const { connectionStr } = require('./config')

mongoose.set('useFindAndModify', false)

mongoose.connect(connectionStr,
  { useNewUrlParser: true },
  () => {
    console.log()
  }
)
mongoose.connection.on('error', console.error)
