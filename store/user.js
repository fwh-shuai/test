export const state = () => ({
  // 采用接口返回的数据结构
  userInfo: {
    token: '',
    user: {}
  }
})
// 改变数据状态
export const mutations = {
  setUserInfo (state, data) {
    state.userInfo = data
  }
}
