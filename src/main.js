// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store'
import '@/styles/index.less'


import {
    Search,
    Cell,
    CellGroup,
    Field,
    Checkbox,
    CheckboxGroup,
    Toast,
    Dialog,
    Loading,
    List,
    Button,
    Icon,
    NoticeBar,
    Popup,
    Picker,
    Tabbar, TabbarItem,
    DropdownMenu, DropdownItem,
    Switch,
    SwitchCell
} from 'vant';
import 'vant/lib/index.css';

Vue.config.productionTip = false

Vue.use(SwitchCell)
    .use(Switch).use(DropdownMenu)
    .use(DropdownItem).use(Tabbar)
    .use(TabbarItem)
    .use(Search)
    .use(Cell)
    .use(Picker)
    .use(Popup)
    .use(CellGroup)
    .use(Field)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Toast)
    .use(Dialog)
    .use(Loading)
    .use(List)
    .use(Button)
    .use(Icon)
    .use(NoticeBar);
    Toast.setDefaultOptions({ duration: 1000 });
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
