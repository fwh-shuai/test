export const state = () => ({
  list: []
})
export const mutations = {
  addHistoryItem (state, date) {
    state.list.push(date)
    console.log(state)
  }
}
