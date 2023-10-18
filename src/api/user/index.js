import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/user/list',
  detail: '/user/detail',
  recharge: '/user/recharge',
  grade: '/user/grade',
  delete: '/user/delete',
  logList: '/fx_user_login_log/list',
  smsListLog: '/sms_log/LoginLog',
  smsDelete: '/sms_log/delete',
  childList: '/user/getChildLists',
  phoneedit: '/user/setNewMobile',
  setsvip: '/user/setSvip'
}

export function phoneedit (data) {
  return axios({
    url: api.phoneedit,
    method: 'post',
    data
  })
}


/**
 * 修改Svip
 * @param {*} data
 */
export function setsvip (data) {
  return axios({
    url: api.setsvip,
    method: 'post',
    data
  })
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
 * 详情记录
 */
export function detail (params) {
  return axios({
    url: api.detail,
    method: 'get',
    params
  })
}

/**
 * 会员充值
 * @param {*} data
 */
export function recharge (data) {
  return axios({
    url: api.recharge,
    method: 'post',
    data
  })
}

/**
 * 修改会员等级
 * @param {*} data
 */
export function grade (data) {
  return axios({
    url: api.grade,
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

export function logList (params) {
  return axios({
    url: api.logList,
    method: 'get',
    params
  })
}

export function smsListLog (params) {
  return axios({
    url: api.smsListLog,
    method: 'get',
    params
  })
}

export function smsDelete (data) {
  return axios({
    url: api.smsDelete,
    method: 'post',
    data
  })
}

export function childList (data) {
  return axios({
    url: api.childList,
    method: 'post',
    data
  })
}
