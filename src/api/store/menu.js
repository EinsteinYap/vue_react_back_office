import { axios } from '@/utils/request'

// api接口列表
const api = {
  list: '/store.menu/list',
  info: '/store.menu/info',
  add: '/store.menu/add',
  edit: '/store.menu/edit',
  deleted: '/store.menu/delete',
  setApis: '/store.menu/setApis'
}

// 菜单权限列表
export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

/**
 * 获取单条记录信息
 * @param {*} params
 */
export function info (params) {
  return axios({
    url: api.info,
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
 * 编辑记录
 * @param {*} data
 */
export function setApis (data) {
  return axios({
    url: api.setApis,
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
