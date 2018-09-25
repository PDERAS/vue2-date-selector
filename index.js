import DateSelector from './components/DateSelector'
import CalendarPicker from './components/CalendarPicker'

function install(Vue, options) {
    Vue.component('date-selector', DateSelector);
    Vue.component('calendar-picker', CalendarPicker)
}

export default install;
