import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fx_version/list',
  edit: '/fx_version/edit',
  detail: '/fx_version/detail',
  add: '/fx_version/add',
  delete: '/fx_version/delete'
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

export function edit (data) {
  return axios({
    url: api.edit,
    method: 'post',
    data
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
