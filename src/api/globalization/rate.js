import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  // 区号列表
  list: '/fx_exchange/list',
  // 区号详情
  detail: '/fx_exchange/detail',
  // 区号编辑
  edit: '/fx_exchange/edit',
  // 区号删除
  delete: '/fx_exchange/delete',
  // 区号添加
  add: '/fx_exchange/add'
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
export function deleted (data) {
  return axios({
    url: api.delete,
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
