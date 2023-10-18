import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fx_paper/list',
  add: '/fx_paper/add',
  switchStatus: '/fx_paper/switchStatus',
  paperLists: '/fx_paper_lists/list'
}

/**
 * 获取列表
 * @param {*} params
 */
export function paperLists (params) {
  return axios({
    url: api.paperLists,
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
 * 删除记录
 * @param {*} data
 */
export function switchStatus (data) {
  return axios({
    url: api.switchStatus,
    method: 'post',
    data: data
  })
}
