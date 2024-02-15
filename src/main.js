import 'primevue/resources/themes/lara-light-green/theme.css'
import 'primeicons/primeicons.css'
import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

import App from './App.vue'

const app = createApp(App)

app.use(PrimeVue);
app.use(ToastService);
app.use(createPinia())

app.mount('#app')
