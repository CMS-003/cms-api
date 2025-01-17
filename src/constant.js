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
  },
  PATH: {
    ROOT: root_path,
    SRC: path.join(root_path, 'src'),
    STATIC: path.join(root_path, 'static'),
  }
}