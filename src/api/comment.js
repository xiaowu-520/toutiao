import request from '@/utils/request'

/**
 * 对评论或评论回复点赞
 */
export function addCommentLike(commentId) {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target: commentId
    }
  })
}

/**
   * 取消对评论或评论回复点赞
   */
export function deleteCommentLike(commentId) {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${commentId}`
  })
}
/**
 *
 * @param {*} target 评论目标ID
 * @param {*} content 评论内容
 * @param {*} artId 文章ID
 * @returns
 */
// 回复评论
export function addComments(target, content, artId) {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data: {
      target,
      content,
      art_id: artId
    }
  })
}
