import DateSelector from './components/DateSelector.vue'
import options from './options';

export default {
    install (Vue, options) {
        Vue.component('date-selector', DateSelector);
    }
}
