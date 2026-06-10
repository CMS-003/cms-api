import path from 'path'

const root_path = process.cwd()

export default {
  // email
  emailTemplats: {},
  SYSTEM: {
    REQ_PAGE: 'page',
    REQ_LIMIT: 'size',
    MAX_LIMIT: 100,
    DEFAULT_LIMIT: 20,
    MONGO_HOLDER: '*',
  },
  VALID_METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  PATH: {
    ROOT: root_path,
    SRC: path.join(root_path, 'src'),
    STATIC: process.env.static || path.join(root_path, 'static'),
  }
}