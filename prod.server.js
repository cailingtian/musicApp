var express = require ('express')
var config = require('./config/index')
var axios = require('axios')

const app = express()
var apiRoutes = express.Router()
app.use('/api', apiRoutes)

var port = process.env.PORT || config.build.port

app.get('/api/getDiscList', function (req, res) {
var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
axios.get(url, {
    headers: {
    // referer: 'https://y.qq.com/portal/playlist.html'
    referer: 'https://y.qq.com/',
    host: 'c.y.qq.com'
    },
    params: req.query
}).then((response) => {
    res.json(response.data)
}).catch((e) => {
    console.log(e)
})
}),
app.get('/api/lyric', function (req, res) {
var url = 'https://szc.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
axios.get(url, {
    headers: {
    referer: 'https://y.qq.com/',
    host: 'c.y.qq.com'
    },
    params: req.query
}).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
    var reg = /^\w+\(({[^()]+})\)$/
    var matches = ret.match(reg)
    if (matches) {
        ret = JSON.parse(matches[1])
    }
    }
    res.json(ret)
}).catch((e) => {
    console.log(e)
})
}),
app.get('/api/getSongList', function (req, res) {
var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
axios.get(url, {
    headers: {
    referer: 'https://y.qq.com/',
    host: 'c.y.qq.com'
    },
    params: req.query
}).then((response) => {
    res.json(response.data)
}).catch((e) => {
    console.log(e)
})
}),
app.get('/api/getSearch', (req, res) => {
var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
axios.get(url, {
    headers: {
    referer: 'https://y.qq.com/m/index.html',
    host: 'c.y.qq.com'
    },
    params: req.query // 通过req从浏览器端发过来的一堆参数(platform，sin，ein等)透传给qq的服务端
}).then((response) => { // qq服务端的响应数据，再通过res将响应数据输出到浏览器端
    res.json(response.data)
}).catch((error) => {
    console.log(error)
})
})

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
    if (err) {
      console.log(err)
      return
    }
    console.log('Listening at http://localhost:' + port + '\n')
  })
    
  