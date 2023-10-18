import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fx_payment/list',
  detail: '/fx_payment/detail',
  add: '/fx_payment/add',
  edit: '/fx_payment/edit',
  delete: '/fx_payment/delete',
  option: 'fx_payment/optionLists',
  withdraw: '/fx_payment/withdraw',
  allList: '/fx_payment/allList'
}
export function allList (params) {
  return axios({
    url: api.allList,
    method: 'get',
    params
  })
}


export function option (params) {
  return axios({
    url: api.option,
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

export function withdrawList (params) {
  return axios({
    url: api.withdraw,
    method: 'get',
    params
  })
}
