import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  // 区号列表
  list: '/fx_area_code/list',
  // 区号详情
  detail: '/fx_area_code/detail',
  // 区号编辑
  edit: '/fx_area_code/edit',
  // 区号删除
  delete: '/fx_area_code/delete',
  // 区号添加
  create: '/fx_area_code/add',
  // 所有区号
  all: '/fx_area_code/getAllList'
}

export function all (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
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
export function create (data) {
  return axios({
    url: api.create,
    method: 'post',
    data
  })
}
