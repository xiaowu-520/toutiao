import request from '@/utils/request'

/**
 *
 * @param {String} articleId 文章ID
 * @returns Promise
 */
// 获取文章内容
export const getArticles = (articleId) => {
  return request({
    url: `/v1_0/articles/${articleId}`
  })
}
// 获取文章评论
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

// 添加关注
export const addFollow = (target) => {
  return request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
      target
    }
  })
}
// 取消关注
export const deleteFollow = (UserId) => {
  return request({
    url: `/v1_0/user/followings/${UserId}`,
    method: 'DELETE'
  })
}

// 添加收藏
export const addCollect = (target) => {
  return request({
    url: '/v1_0/article/collections',
    method: 'POST',
    data: {
      target
    }
  })
}
// 取消收藏
export const deleteCollect = (target) => {
  return request({
    url: `/v1_0/article/collections/${target}`,
    method: 'DELETE'
  })
}

// 点赞
export const addLike = (target) => {
  return request({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: {
      target
    }
  })
}
// 取消点赞
export const deleteLike = (target) => {
  return request({
    url: `/v1_0/article/likings/${target}`,
    method: 'DELETE'
  })
}
