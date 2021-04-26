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

const getQueryParams = (url) => {
    let args = new Object();
    let query = url.substring(url.indexOf('?') + 1);
    let pairs = query.split("&");
    for (let i = 0; i < pairs.length; i++) {
        let pos = pairs[i].indexOf('=');
        if (pos == -1) continue;
        let argname = pairs[i].substring(0, pos);
        let value = pairs[i].substring(pos + 1);
        args[argname] = unescape(value);
    }
    args.home = url.split('?')[0]
    return args;
}

let queryParams = getQueryParams(location.href);
window.venues = queryParams.aid && queryParams.aid.split('#')[0];

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
