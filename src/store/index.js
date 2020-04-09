import vue from 'vue'
import vuex from 'vuex'
vue.use(vuex)
const state = {
    username: '',
    userId: ''
}
const mutations = {
    setUserInfo(state, userInfo) {
        state.username = userInfo.MC;
        state.userId = userInfo.BM;
        localStorage.setItem('username', userInfo.MC);
        localStorage.setItem('userId', userInfo.BM);
    }
}
const getters = {
    getUsername(state) {
        return localStorage.getItem('username');
    },
    getUserId(state) {
        return localStorage.getItem('userId');
    },
    getUserMc(state) {
        return localStorage.getItem('mc');
    }
}

export default new vuex.Store({
    state,
    mutations,
    getters
})