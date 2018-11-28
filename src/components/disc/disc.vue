<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong2} from 'common/js/song'
import {getSongVkey} from 'api/singer'

export default {
    name: 'Disc',
    components: {
        MusicList
    },
    data() {
        return {
            songs: []
        }
    },
    computed: {
        title() {
            return this.disc.dissname
        },
        bgImage() {
            return this.disc.imgurl
        },
        ...mapGetters([
            'disc'
        ])
    },
    created() {
        this._getSongList()
    },
    methods: {
        _getSongList () {
            if (!this.disc.dissid) {
                this.$router.push('/recommend')
                return
            }
            getSongList(this.disc.dissid).then((res) => {
                if (res.code === ERR_OK) {
                this.songs = this._normalizeSongs((res.cdlist[0].songlist))
                // 调试接口数据 console.log(res)
                // 调试接口数据 console.log(res.cdlist[0].songlist)
                console.log(this.songs)
                }
            })
    },
        _normalizeSongs (list) {
            let ret = []
            list.forEach((musicData) => {
                 getSongVkey(musicData.mid).then((res) => {
                    // console.log('这首歌的vkey获取到了')
                    // 调试获取vkey接口数据 console.log(res)
                    const vkey = res.data.items[0].vkey
                    // 调试获取vkey接口数据 console.log(vkey)
                    if (musicData.id && musicData.album) {
                        ret.push(createSong2(musicData, vkey))
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