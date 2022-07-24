import request from '@/utils/request'

/**
 *
 * @param {String} articleId 文章ID
 * @returns Promise
 */

export const getArticles = (articleId) => {
  return request({
    url: `/v1_0/articles/${articleId}`
  })
}

export const getArticleComments = (type, source, offset, limit) => {
  return request({
    url: '/v1_0/comments',
    params: {
      type,
      source,
      offset,
      limit
    }
  })
}
