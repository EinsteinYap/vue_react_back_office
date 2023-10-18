import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  info: '/store.user/info',
  list: '/store.user/list',
  add: '/store.user/add',
  edit: '/store.user/edit',
  delete: '/store.user/delete',
  renew: '/store.user/renew',
  // 冻结登录
  setLoginStatus: '/user/setLoginStatus',
  // 冻结提现
  setFreezeWithdraw: '/user/setFreezeWithdraw',
  // 冻结收益
  setFreezeProfit: '/user/setFreezeProfit',
  // 重置密码
  setNewPwd: '/user/setNewPwd',
  // 重置支付密码
  setNewPayPwd: '/user/setNewPayPwd',
  // 修改上级ID
  setParentId: '/user/setParentId',
  // 修改上级员工
  setStaffId: '/user/setStaffId',
  // 查看二维码
  qrcodelook: '/store.user/QRCodeGoogleUrl',
  // 清空验证码
  clearSecret: '/store.user/clearSecret',
  addpay: 'fx_user_payment/add'

}
export function addpay (data) {
  return axios({
    url: api.addpay,
    method: 'post',
    data
  })
}
/**
 * 获取当前登录的用户信息
 */
export function getInfo () {
  return axios({
    url: api.info,
    method: 'get'
  })
}

/**
 * 更新当前管理员信息
 * @param {*} data
 */
export function renew (data) {
  return axios({
    url: api.renew,
    method: 'post',
    data
  })
}



/**
 * 管理员列表
 */
export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

export function clearSecret (data) {
  return axios({
    url: api.clearSecret,
    method: 'post',
    data
  })
}

export function qrcodelook(params) {
  return axios({
    url: api.qrcodelook,
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
    data
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

export function setLoginStatus (data) {
  return axios({
    url: api.setLoginStatus,
    method: 'post',
    data
  })
}
export function setFreezeWithdraw (data) {
  return axios({
    url: api.setFreezeWithdraw,
    method: 'post',
    data
  })
}
export function setFreezeProfit (data) {
  return axios({
    url: api.setFreezeProfit,
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
export function setNewPayPwd (data) {
  return axios({
    url: api.setNewPayPwd,
    method: 'post',
    data
  })
}
export function setParentId (data) {
  return axios({
    url: api.setParentId,
    method: 'post',
    data
  })
}
export function setStaffId (data) {
  return axios({
    url: api.setStaffId,
    method: 'post',
    data
  })
}
