const devConfig = require('./development')
const prodConfig = require('./production')
let config = {};
if (process.env.NODE_ENV === 'development') {
  config = devConfig
}
if (process.env.NODE_ENV === 'production') {
  config = prodConfig
}

module.exports = config;