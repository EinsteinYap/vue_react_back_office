import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/user.commission/log',
  scene: '/user.commission/scene'
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
