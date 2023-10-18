import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/user.balance/log',
  scene: '/user.balance/scene'
}

export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}
export function scene (params) {
  return axios({
    url: api.scene,
    method: 'get',
    params
  })
}
