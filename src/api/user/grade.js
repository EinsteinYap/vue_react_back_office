import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  // list: '/fx_exchange/list',
  // add: '/fx_exchange/add',
  // edit: '/fx_exchange/edit',
  // delete: '/fx_exchange/delete',
  // detail: '/fx_exchange/detail'
  list: '/user.grade/list',
  all: '/user.grade/all',
  add: '/user.grade/add',
  edit: '/user.grade/edit',
  delete: '/user.grade/delete'
}

/**
 * 列表记录
 */
export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

/**
 * 全部记录
 */
export function all (params) {
  return axios({
    url: api.all,
    method: 'get',
    params
  })
}

/**
 * 新增记录
 * @param {*} data
 */
export function add (data) {
  return axios({
    url: api.add,
    method: 'post',
    data
  })
}

/**
 * 编辑记录
 * @param {*} data
 */
export function edit (data) {
  return axios({
    url: api.edit,
    method: 'post',
    data
  })
}

/**
 * 删除记录
 * @param {*} data
 */
export function deleted (data) {
  return axios({
    url: api.delete,
    method: 'post',
    data: data
  })
}

export function detail (params) {
  return axios({
    url: api.detail,
    method: 'get',
    params
  })
}
