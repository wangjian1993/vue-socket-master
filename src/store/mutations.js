// export const mutationsMsg = (state, payload) => {
//   state.tabStates = payload.tabStates;
// }
import * as types from './mutation-type.js';
const mutations = {
  [types.SET_SONGSLIST](state, list) {
    state.songsList = list;
  },
  [types.SET_AUDIOLIST](state, data) {
    state.audioList = data;
    state.isAudio = !state.isAudio;
  }
}
export default mutations

