export default {
  updateTabbar (state, showTabbar) {
    state.showTabbar = showTabbar
  },
  updateLoginFrom (state, fullpath) {
    state.loginFromPath = fullpath
  },
  updateSyncUsered (state, synced) {
    state.syncUsered = synced
  }
}
