import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fx_user_payment/list',
  delete: '/fx_user_payment/delete',

}



export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}
export function deleted (data) {
  return axios({
    url: api.delete,
    method: 'post',
    data
  })
}
