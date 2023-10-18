import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fx_customer/list',
  add: '/fx_customer/add',
  edit: '/fx_customer/edit',
  detail: '/fx_customer/detail',
  delete: '/fx_customer/delete'
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

export function deleted (data) {
  return axios({
    url: api.delete,
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
