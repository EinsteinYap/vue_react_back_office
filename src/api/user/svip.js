import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
    list: '/fx_vip_grade/list',
    all: '/fx_vip_grade/getAllList',
    add: '/fx_vip_grade/add',
    edit: '/fx_vip_grade/edit',
    delete: '/fx_vip_grade/delete',
    log: '/user.grade_log/lists',
    types: '/user.grade_log/changtype'
}


/**
 * 变更类型
 */
export function types (params) {
    return axios({
        url: api.types,
        method: 'get',
        params
    })
}

/**
 * 升级记录
 */
export function log (params) {
    return axios({
        url: api.log,
        method: 'get',
        params
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
 * 全部记录
 */
export function all (params) {
    return axios({
        url: api.all,
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

export function detail (params) {
    return axios({
        url: api.detail,
        method: 'get',
        params
    })
}
