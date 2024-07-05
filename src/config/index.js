import dev from './development.js'
import prod from './production.js'

let config = {};
if (process.env.NODE_ENV === 'development') {
  config = dev
}
if (process.env.NODE_ENV === 'production') {
  config = prod
}

export default config;