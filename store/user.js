export const state = () => ({
  // 采用接口返回的数据结构
  userInfo: {
    token: '',
    user: {}
  }
})
// 改变数据状态,mutation里面每个属性都是函数
export const mutations = {
  setUserInfo (state, data) {
    state.userInfo = data
  }
}
// 异步不能写在mutation里面，如果不想多次写axios可写在action里面,调用action相当于调用了mutation
export const actions = {
  // 登录
  login ({ commit }, data) {
    // 这里的 return 是为了能够对外返回一个带数据的 promise 方便外面继续进行处理
    // 为啥去掉这个return会先执行外面的then再执行下面的then
    // 不写return是返回promise对象不过不会返回到login函数外面，外面用不了
    return this.$axios({
      url: '/accounts/login',
      method: 'POST',
      data

    }).then((res) => {
      // console.log(res)
      commit('setUserInfo', res.data)
      // 这个return是必须的，每个.then后面要是还想要继续.then或.catch必须要有返回
      return res.data
    })
  }
}
