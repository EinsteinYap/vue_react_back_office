import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fx_order/list',
  total: '/fx_order/total',
  cancel: '/fx_order/cancel',
  switchStatus: '/fx_order/switchStatus',
  changeTotalProfit: '/fx_order/changeTotalProfit'
}

// 列表记录
export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

// 订单详情
export function detail (params) {
  return axios({
    url: api.detail,
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

export function cancel (data) {
  return axios({
    url: api.cancel,
    method: 'post',
    data
  })
}

export function switchStatus (data) {
  return axios({
    url: api.switchStatus,
    method: 'post',
    data
  })
}

export function changeTotalProfit (data) {
  return axios({
    url: api.changeTotalProfit,
    method: 'post',
    data
  })
}
