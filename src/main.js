// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/styles/index.less'
import { Search,Cell, CellGroup,Field,Checkbox, CheckboxGroup,Toast ,Dialog,Loading ,List     } from 'vant';
import 'vant/lib/index.css';

Vue.config.productionTip = false

Vue.use(Search ).use(Cell ).use(CellGroup ).use(Field ).use(Checkbox ).use(CheckboxGroup ).use(Toast ).use(Dialog).use(Loading).use(List);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
