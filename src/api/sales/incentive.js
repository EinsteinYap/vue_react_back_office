import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fx_invite_rule/list',
  add: '/fx_invite_rule/add',
  edit: '/fx_invite_rule/edit',
  detail: '/fx_invite_rule/detail',
  deleted: '/fx_invite_rule/delete',
  giftGoods: '/user/giftGoods'

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

export function giftGoods (data) {
  return axios({
    url: api.giftGoods,
    method: 'post',
    data: data
  })
}
