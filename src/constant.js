import path from 'path'

const root_path = process.cwd()

export default {
  JOB_STATUS: {
    PENDDING: 1,
    SUCCESS: 2,
    FAIL: 3,
    TIMEOUT: 4,
  },
  HOLIDAY: [
    '2022-01-01',
    '2022-01-02',
    '2022-01-03',
    '2022-01-31',
    '2022-02-01',
    '2022-02-02',
    '2022-02-03',
    '2022-02-04',
    '2022-02-05',
    '2022-02-06',
    '2022-04-03',
    '2022-04-04',
    '2022-04-05',
    '2022-04-30',
    '2022-05-01',
    '2022-05-02',
    '2022-05-03',
    '2022-05-04',
    '2022-06-03',
    '2022-06-04',
    '2022-06-05',
    '2022-09-10',
    '2022-09-11',
    '2022-09-12',
    '2022-10-01',
    '2022-10-02',
    '2022-10-03',
    '2022-10-04',
    '2022-10-05',
    '2022-10-06',
    '2022-10-07',
  ],
  // email
  emailTemplats: {},
  SYSTEM: {
    REQ_PAGE: 'page',
    REQ_LIMIT: 'size'
  },
  PATH: {
    ROOT: root_path,
    SRC: path.join(root_path, 'src'),
    STATIC: path.join(root_path, 'static'),
    TEMPLATE: path.join(root_path, 'src/templates')
  }
}