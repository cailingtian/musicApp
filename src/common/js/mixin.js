import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
        'playList'
    ])
  },
  munnted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(newVal) {
    this.handlePlaylist(newVal)
    }
  },
  methods: {
      handlePlaylist() {
        throw new Error('component must implement handelPlaylist method')
      }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      'mode',
      'favoriteList'
  ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
      } else {
          list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
  },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 控制收藏喜欢图标的高亮
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  methods: {
    // 解决移动端列表滚动，物理键盘收起问题
    blurInput() {
      this.$refs.searchBox.blur()
    },
    // 保存搜索历史结果，并缓存到本地存储
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    onQueryChange(query) {
      this.query = query
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  }
}
