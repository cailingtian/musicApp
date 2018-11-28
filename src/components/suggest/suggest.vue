<template>
    <scroll class="suggest"
            :data="result"
            :pullup="pullup"
            :beforeScroll="beforeScroll"
            @scrollToEnd="searchMore"
            @beforeScroll="listScroll"
            ref="suggest"
            >
        <ul class="suggest-list">
            <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <div v-show="hasMore && !result.length" class="no-result-wrapper">
            <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
    </scroll>
</template>

<script>
import {getSearch} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
import NoResult from 'base/no-result/no-result'
import {getSongVkey} from 'api/singer'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
    name: 'Suggest',
    props: {
        query: {
            type: String,
            default: ''
        },
        showSinger: {
            type: Boolean,
            default: true
        }
    },
    components: {
        Scroll,
        Loading,
        NoResult
    },
    data() {
        return {
            page: 1,
            result: [],
            pullup: true,
            beforeScroll: true,
            hasMore: false
        }
    },
    methods: {
        selectItem(item) {
            if (item.type === TYPE_SINGER) {
                const singer = new Singer({
                    id: item.singermid,
                    name: item.singername
                })
                this.$router.push({
                    path: `/search/${singer.id}`
                })
                this.setSinger(singer)
            } else {
                this.insertSong(item)
            }
            // 向父组件派发保存搜索历史的事件
            this.$emit('select')
        },
        _getSearch() {
            this.page = 1
            this.hasMore = true
            this.$refs.suggest.scrollTo(0, 0)
            getSearch(this.query, this.page, this.showSinger, perpage).then((res) => {
                if (res.code === ERR_OK) {
                    this.result = this._genResult(res.data)
                    console.log(this.result)
                    this._checkMore(res.data)
                }
            })
        },
        searchMore() {
            if (!this.hasMore) {
                return
            }
            this.page++
            getSearch(this.query, this.page, this.showSinger, perpage).then((res) => {
                if (res.code === ERR_OK) {
                    this.result = this.result.concat(this._genResult(res.data))
                    console.log(this.result)
                    this._checkMore(res.data)
                }
            })
        },
        getDisplayName(item) {
            if (item.type === TYPE_SINGER) {
                return item.singername
            } else {
                return `${item.name}-${item.singer}`
            }
        },
        getIconCls(item) {
            if (item.type === TYPE_SINGER) {
                return 'icon-mine'
            } else {
                return 'icon-music'
            }
        },
        // 解决移动端列表滚动，物理键盘收起问题
        listScroll() {
            this.$emit('listScroll')
        },
        refresh() {
            this.$refs.suggest.refresh()
        },
        _checkMore(data) {
            const song = data.song
            if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
                this.hasMore = false
            }
        },
        _genResult(data) {
            let ret = []
            if (data.zhida && data.zhida.singerid) {
                ret.push({...data.zhida, ...{type: TYPE_SINGER}})
            }
            if (data.song) {
                ret = this._normalizeSongs(data.song.list)
            }
            return ret
        },
        _normalizeSongs(list) {
            let ret = []
            list.forEach((musicData) => {
                getSongVkey(musicData.songmid).then((res) => {
                    // console.log('这首歌的vkey获取到了')
                    // 调试获取vkey接口数据 console.log(res)
                    const vkey = res.data.items[0].vkey
                    // 调试获取vkey接口数据 console.log(vkey)
                    if (musicData.songid && musicData.albummid) {
                        ret.push(createSong(musicData, vkey))
                    }
                })
            })
            return ret
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        }),
        ...mapActions([
            'insertSong'
        ])
    },
    watch: {
        query() {
            this._getSearch()
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
    .suggest
        height: 100%
        overflow: hidden
        .suggest-list
            padding: 0 30px
            .suggest-item
                display: flex
                align-items: center
                padding-bottom: 20px
            .icon
                flex: 0 0 30px
                width: 30px
                [class^="icon-"]
                    font-size: 14px
                    color: $color-text-d
            .name
                flex: 1
                font-size: $font-size-medium
                color: $color-text-d
                overflow: hidden
                .text
                    no-wrap()
        .no-result-wrapper
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>
