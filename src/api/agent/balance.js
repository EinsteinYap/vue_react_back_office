import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fx_agent_balance_log/balanceList'
}

export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}
