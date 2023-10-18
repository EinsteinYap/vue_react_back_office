import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/user.recharge/order',
  total: '/user.recharge/total',
  apply: '/user.recharge/apply'
}

export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}
export function total (params) {
  return axios({
    url: api.total,
    method: 'get',
    params
  })
}

export function apply (data) {
  return axios({
    url: api.apply,
    method: 'post',
    data
  })
}
