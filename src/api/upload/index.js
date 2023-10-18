import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  image: '/upload/image',
  video: '/upload/video',
  annex: '/upload/annex'
}

/**
 * 上传文件
 * @param {*} data
 */
export function annex (data) {
  return axios({
    url: api.annex,
    method: 'post',
    data
  })
}

/**
 * 上传图片
 * @param {*} data
 */
export function image (data) {
  return axios({
    url: api.image,
    method: 'post',
    data
  })
}

/**
 * 上传视频
 * @param {*} data
 */
export function video (data) {
  return axios({
    url: api.video,
    method: 'post',
    data
  })
}
