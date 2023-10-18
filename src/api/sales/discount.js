import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fx_discount_goods/list',
  add: '/fx_discount_goods/add',
  edit: '/fx_discount_goods/edit',
  detail: '/fx_discount_goods/detail',
  deleted: '/fx_discount_goods/delete'
}

/**
 * 获取列表
 * @param {*} params
 */
export function detail (params) {
  return axios({
    url: api.detail,
    method: 'get',
    params
  })
}

/**
 * 获取详情
 * @param {*} params
 */
export function list (params) {
  return axios({
    url: api.list,
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
    data: data
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
    data: data
  })
}

/**
 * 删除记录
 * @param {*} data
 */
export function deleted (data) {
  return axios({
    url: api.deleted,
    method: 'post',
    data: data
  })
}
