import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config.js'
import axios from 'axios'

export function getHotKey() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

    const data = Object.assign({}, commonParams, {
      uin: 0,
      needNewCode: 1,
      platform: 'h5'
    })

    return jsonp(url, data, options)
  }

export function getSearch(query, page, zhida, perpage) {
  // 通过自身模拟服务器访问有host权限的数据
  const url = '/api/getSearch'
  // 把hash做成对象,es6创建对象并赋值,
  // 固定的hash写在变量js模块里， config.js
  const data = Object.assign({}, commonParams, {
    w: query,	// 关键词
    p: page,	// 展示页数
    perpage: perpage,	// 一页展示多少数据
    n: perpage,
    catZhida: zhida ? 1 : 0,	// 是否单独展示歌手
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    format: 'json'
  })

  // 执行jsonp模块
	return axios.get(url, {
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
