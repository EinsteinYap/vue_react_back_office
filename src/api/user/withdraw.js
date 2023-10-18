import { axios } from '@/utils/request'

const api = {
  list: '/user.withdraw/list',
  total: '/user.withdraw/total',
  audit: '/user.withdraw/audit',
  error: '/user.withdraw/setFail',
  operation: '/user.withdraw/operation'
}

export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

export function total (params) {
  return axios({
    url: api.total,
    method: 'get',
    params
  })
}

export function audit (data) {
  return axios({
    url: api.audit,
    method: 'post',
    data
  })
}

export function error (data) {
  return axios({
    url: api.error,
    method: 'post',
    data
  })
}

export function operation (data) {
  return axios({
    url: api.operation,
    method: 'post',
    data
  })
}
