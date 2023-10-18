import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fx_turn_opt/list',
  add: '/fx_turn_opt/add',
  edit: '/fx_turn_opt/edit',
  detail: '/fx_turn_opt/detail',
  deleted: '/fx_turn_opt/delete',
  all: '/fx_turn_opt/getAllList',
  log: 'fx_turn_lottery/list'
}

/**
 * 获取列表
 * @param {*} params
 */
export function log (params) {
  return axios({
    url: api.log,
    method: 'get',
    params
  })
}

/**
 * 获取列表
 * @param {*} params
 */
export function all (params) {
  return axios({
    url: api.all,
    method: 'get',
    params
  })
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
