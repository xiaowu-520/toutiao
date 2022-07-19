import request from '@/utils/request'
import storage from '@/utils/storage'

export const getMyChannels = () => {
  return request({
    url: '/v1_0/user/channels'
  })
}

export const getAllChannels = () => {
  return request({
    url: '/v1_0/channels'
  })
}
/**
 *
 * @param {String | Number} target 删除频道
 * @returns Promise
 */
export const delMyChannel = (target) => {
  return request({
    url: `/v1_0/user/channels/${target}`,
    method: 'DELETE'
  })
}
/**
 *
 * @param {Number} id 频道id
 * @param {Number} seq 频道的下标
 * @returns Promise
 */
export const addMyChannel = (id, seq) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PATCH',
    data: {
      channels: [{ id, seq }]
    }
  })
}

const TOUTIAO_CHANNELS = 'TOUTIAO_CHANNELS'

export const getMyChannelsByLocal = () => storage.get(TOUTIAO_CHANNELS)

export const setMyChannelsToLocal = (channel) => storage.set(TOUTIAO_CHANNELS, channel)
