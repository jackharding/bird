import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
import App from './App.vue';

Vue.use(AsyncComputed);

new Vue({
	el: '#app',
	render: h => h(App)
})
