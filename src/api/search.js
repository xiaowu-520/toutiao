import request from '@/utils/request'
import storage from '@/utils/storage'

export const getSuggest = (q) => {
  return request({
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}

export const getResult = (q, page, perPage) => {
  return request({
    url: '/v1_0/search',
    params: {
      q,
      page,
      per_page: perPage
    }
  })
}

// 封装本地存储搜索历史
const TOUTIAO_SEARCHS = 'TOUTIAO_SEARCHS'

export const getHistoryByLocal = () => storage.get(TOUTIAO_SEARCHS)

export const setHistoryToLocal = (searchs) => storage.set(TOUTIAO_SEARCHS, searchs)
