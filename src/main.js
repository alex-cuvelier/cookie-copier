import 'primeicons/primeicons.css';
import './assets/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import primevue from './plugins/primevue';

import App from './App.vue';

const app = createApp(App);

app.use(primevue);
app.use(createPinia());

app.mount('#app');
