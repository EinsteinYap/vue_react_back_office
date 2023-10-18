import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fx_task/list',
  add: '/fx_task/add',
  edit: '/fx_task/edit',
  detail: '/fx_task/detail',
  deleted: '/fx_task/delete',
  logList: '/fx_task_lists/list',
  apply: 'fx_task_lists/apply',
  corre: '/fx_task/correlation',
  correList: '/fx_task/correlationLists'
}


/**
 * 获取列表
 * @param {*} data
 */
export function corre (data) {
  return axios({
    url: api.corre,
    method: 'post',
    data
  })
}



/**
 * 获取列表
 * @param {*} params
 */
export function correList (params) {
  return axios({
    url: api.correList,
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
 * 获取详情
 * @param {*} params
 */
export function logList (params) {
  return axios({
    url: api.logList,
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

/**
 * 审核任务
 * @param {*} data
 */
export function apply (data) {
  return axios({
    url: api.apply,
    method: 'post',
    data: data
  })
}
