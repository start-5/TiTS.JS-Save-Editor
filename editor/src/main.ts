import { createApp } from 'vue';

import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import App from '@/App.vue';

import '@/assets/styles/main.css';

const app = createApp(App);

app.use(VueVirtualScroller);

app.mount('#app');
