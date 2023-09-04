module.exports = {
  tokenNotFound: {
    status: 400,
    code: 101000,
    message: 'token未找到!'
  },
  tokenExpired: {
    status: 400,
    code: 101010,
    message: 'token已过期!'
  },
  tokenFail: {
    status: 400,
    code: 101020,
    message: 'token错误!'
  },
  NoPermission: {
    status: 400,
    code: 101030,
    message: '权限不足!'
  },
  VerifyError: {
    status: 400,
    code: 101070,
    message: '验证码错误!'
  },
  PassError: {
    status: 200,
    code: 101080,
    message: '账号或密码错误'
  }
};