import storage from './storage'

const touToken = 'toutiao_token'

export const getToken = () => storage.get(touToken)

export const setToken = (token) => storage.set(touToken, token)

export const removeToken = () => storage.remove(touToken)
