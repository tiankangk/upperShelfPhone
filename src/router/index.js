import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
    routes: [
        {
            path: '/',
            name: '_home',
            redirect:'/home'
        }, 
        {
            path: '/home',
            name: 'home',
            component: () => import('views/home/home.vue')
        },{
            path: '/login',
            name: 'login',
            component: () => import('views/login/login')
        }
    ]
})

router.beforeEach((to,from,next)=>{
    let user = localStorage.getItem('userId');
    if(user){
        next()
    } else {
        if (to.path!='/login'){
            next('/login');
        } else {
            next();
        }
    }
})


export default router