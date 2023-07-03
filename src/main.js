import '@/assets/base.css'
import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VeeValidatePlugin from '@/includes/validation'
import '@/includes/firebase'
import { auth } from '@/includes/firebase'
import App from '@/App.vue'
import router from '@/router'
import i18n from '@/includes/i18n'
import Icon from '@/directives/icon'

let app

auth.onAuthStateChanged(() => {
    if (!app) {
        app = createApp(App)
        app.use(createPinia())
        app.use(router)
        app.use(VeeValidatePlugin)
        app.use(i18n);

        app.directive('icon', Icon)

        app.mount('#app')
    }
})
