import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fx_staff/list',
  add: '/fx_staff/add',
  edit: '/fx_staff/edit',
  delete: '/fx_staff/delete',
  detail: '/fx_staff/detail',
  setNewPwd: '/fx_staff/setNewPwd',
  recharge: '/fx_staff/recharge',
  logList: '/fx_staff_balance_log/list',
  stafflogin: '/fx_staff/login',
  clearSecretStaff: '/fx_staff/clearSecret'

}
export function clearSecretStaff(data) {
  return axios({
    url: api.clearSecretStaff,
    method: 'post',
    data
  })
}

export function stafflogin(data) {
  return axios({
    url: api.stafflogin,
    method: 'post',
    data
  })
}

export function logList (params) {
  return axios({
    url: api.logList,
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

export function add (data) {
  return axios({
    url: api.add,
    method: 'post',
    data
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
export function setNewPwd (data) {
  return axios({
    url: api.setNewPwd,
    method: 'post',
    data
  })
}
export function recharge (data) {
  return axios({
    url: api.recharge,
    method: 'post',
    data
  })
}
