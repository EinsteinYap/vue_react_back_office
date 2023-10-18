import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fx_agent/list',
  add: '/fx_agent/add',
  edit: '/fx_agent/edit',
  delete: '/fx_agent/delete',
  detail: '/fx_agent/detail',
  setNewPwd: '/fx_agent/setNewPwd',
  recharge: '/fx_agent/recharge',
  getAllList: '/fx_agent/getAllList',
  getStaffList: '/fx_staff/childList',
  manageList: '/fx_staff/manager',
  agentlogin: '/fx_agent/login',
  clearSecretAgent: '/fx_agent/clearSecret',

}




export function clearSecretAgent(data) {
  return axios({
    url: api.clearSecretAgent,
    method: 'post',
    data
  })
}


export function agentlogin(data) {
  return axios({
    url: api.agentlogin,
    method: 'post',
    data
  })
}

export function getStaffList (params) {
  return axios({
    url: api.getStaffList,
    method: 'get',
    params
  })
}

export function getAllList (params) {
  return axios({
    url: api.getAllList,
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
export function manageList (params) {
  return axios({
    url: api.manageList,
    method: 'get',
    params
  })
}
