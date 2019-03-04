// export const changeMsg = ({commit},tab) => {
//   commit({
//     type: 'mutationsMsg', //对应mutation.js中的mutationsMsg方法
//     tabStates: tab
//   });
// };
import * as types from "./mutation-type.js";

export default {
  setSongs({
    commit
  }, list) {
    commit(types.SET_SONGSLIST, list);
  },
  setAudio({
    commit
  }, data) {
    commit(types.SET_AUDIOLIST, data);
  },
};
