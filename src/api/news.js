import request from '@/utils/request'

/**
 *
 * @param {*} channelId 频道id
 * @param {*} timestamp 获取当前页的时间戳
 * @returns Promise
 */

export const getArticleList = (channelId, timestamp) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp
    }
  })
}
