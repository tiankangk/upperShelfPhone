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
        console.log('userInfo',userInfo);
        sessionStorage.setItem('username', userInfo.DLMC);
        sessionStorage.setItem('mc', userInfo.MC);
        sessionStorage.setItem('userId', userInfo.BM);
    }
}
const getters = {
    getUsername(state) {
        return sessionStorage.getItem('username');
    },
    getUserId(state) {
        return sessionStorage.getItem('userId');
    },
    getUserMc(state) {
        return sessionStorage.getItem('mc');
    }
}

export default new vuex.Store({
    state,
    mutations,
    getters
})