import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fx_payment_category/list',
  detail: '/fx_payment_category/detail',
  add: '/fx_payment_category/add',
  edit: '/fx_payment_category/edit',
  delete: '/fx_payment_category/delete'
}

export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}
export function detail (params) {
  return axios({
    url: api.detail,
    method: 'get',
    params
  })
}

export function add (data) {
  return axios({
    url: api.add,
    method: 'post',
    data
  })
}
export function edit (data) {
  return axios({
    url: api.edit,
    method: 'post',
    data
  })
}
export function deleted (data) {
  return axios({
    url: api.delete,
    method: 'post',
    data
  })
}
