import request from '@/utils/request'

/**
 *
 * @param {String} mobile
 * @param {String} code
 * @returns Promise
 */
export const login = (mobile, code) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: { mobile, code }
  })
}

export const sendCode = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  })
}

export const getUserInfo = () => {
  return request({
    url: '/v1_0/user'
  })
}

// 获取个人资料
export const getMyInfo = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}

// 编辑个人资料
export const editMyInfo = (data) => {
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}

// 编辑头像
export const userPhoto = (photo) => {
  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: photo

  })
}
