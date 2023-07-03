import { createI18n } from "vue-i18n";
import en from '@/locales/en.json'
import rus from '@/locales/rus.json'

export default createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        rus,
    },
    numberFormats: {
        en: {
            currency: {
                style: 'currency',
                currency: 'USD',
            }
        },
        rus: {
            currency: {
                style: 'currency',
                currency: 'RUB',
            }
        }
    }
})