export const mobileRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '格式不正确' }
]

export const codeRules = [
  { required: true, message: '请输入验证码' },
  { pattern: /^[0-9]{6}$/, message: '格式不正确' }
]
