<template>
    <transition name="slide">
        <div class="singer-detail">
            <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
        </div>
    </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail, getSongVkey} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
  name: 'Singer-detail',
  data () {
      return {
          songs: []
      }
  },
  components: {
      MusicList
  },
  computed: {
      title() {
          return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
    ...mapGetters([
        'singer'
    ])
  },
  created () {
      this._getDetail()
      console.log(this.singer)
  },
  methods: {
      _getDetail() {
          if (!this.singer.id) {
              this.$router.push('/singer')
              return
          }
          getSingerDetail(this.singer.id).then((res) => {
              if (res.code === ERR_OK) {
                  // 调试接口数据 console.log(res)
                    this.songs = this._normalizeSongs(res.data.list)
                   console.log(res.data.list)
                    console.log(this.songs)
              }
          })
      },
      _normalizeSongs(list) {
          let ret = []
          list.forEach((item) => {
              let {musicData} = item
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
    .singer-detail
        position: fixed
        z-index: 100
        top: 0
        left: 0
        bottom: 0
        right: 0
        background: $color-background
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s
    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>