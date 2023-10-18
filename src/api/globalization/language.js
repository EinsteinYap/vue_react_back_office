import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  // 所有语言
  all: '/fx_language/list',
  // 语言列表
  list: '/fx_language/list',
  // 语言详情
  detail: '/fx_language/detail',
  // 语言编辑
  edit: '/fx_language/edit',
  // 语言删除
  delete: '/fx_language/delete',
  // 语言添加
  create: '/fx_language/add'
}

export function all (params) {
  return axios({
    url: api.all,
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
