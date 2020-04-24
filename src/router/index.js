import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
    routes: [
        // {
        //     path: '/',
        //     name: '_home',
        //     redirect:'/home'
        // }, 
        {
            path: '/',
            name: 'home',
            component: () => import('views/home/home.vue'),
            children: [
                {
                    path: 'up_shelf',
                    name: 'up_shelf',
                    component: () => import('views/up-shelf/up-shelf.vue'),
                },
                {
                    path: 'code_manage',
                    name: 'code_manage',
                    component: () => import('views/code-manage/code-manage.vue'),
                }
            ]
        }, {
            path: '/login',
            name: 'login',
            component: () => import('views/login/login')
        }
    ]
})

router.beforeEach((to, from, next) => {
    let user = sessionStorage.getItem('userId');
    if (user) {
        next()
    } else {
        if (to.path != '/login') {
            next('/login');
        } else {
            next();
        }
    }
})


export default router