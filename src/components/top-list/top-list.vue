<template>
    <transition name="slide">
        <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import {createSong} from 'common/js/song.js'
import {ERR_OK} from 'api/config'
import {getSongVkey} from 'api/singer'

export default {
    name: 'TopList',
    components: {
        MusicList
    },
    data() {
        return {
            songs: [],
            rank: false
        }
    },
    computed: {
        title() {
            return this.topList.topTitle
        },
        bgImage() {
            if (this.songs.length) {
                return this.songs[0].image
            }
            return ''
        },
        ...mapGetters([
            'topList'
        ])
    },
    created() {
        this._getMusicList()
    },
    methods: {
        _getMusicList() {
            if (!this.topList.id) {
                this.$router.push('/rank')
                return
            }
            getMusicList(this.topList.id).then((res) => {
                if (res.code === ERR_OK) {
                    // 调试未处理的接口数据 console.log(res)
                   // 调试未处理的接口数据 console.log(res.songlist) 未处理之前的数据
                   this.songs = this._normalizeSongs(res.songlist)
                   console.log(this.songs)
                }
            })
        },
        _normalizeSongs (list) {
                let ret = []
                list.forEach((item) => {
                    const musicData = item.data
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
            }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s
    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>