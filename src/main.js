import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'

import './styles/element-variables.scss'
import '@/styles/index.scss'


import store from './store'

import * as filters from './filters';
import './icons' 
import './permission'
import './utils/error-log'

Vue.use(Element, {
    size: 'medium'
});

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});


Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>'
});
