<template>
    <div class='cal'>
        <div class="cal-title">
            <span @click='prevMonth' class='cal-btn-prev'>
                {{ prev }}
            </span>
            <h1>
                {{ activeYear }} - {{ _allMonths.find(m => m.val === activeMonth).label }}
            </h1>
            <span @click='nextMonth' class='cal-btn-next'>
                {{ next }}
            </span>
        </div>
        <div class="cal-data">
            <div class='cal-day cal-day-header'
                v-for='day in weekdays'
                :key='day'>
                {{ day }}
            </div>

            <div class='cal-day cal-day-inactive'
                v-for='i in startDay'
                :key='`${i}-blank-start`'/>

            <div class='cal-day'
                v-for='i in daysInMonth'
                :key='i'
                :class='generatedClass(i)'
                @click='handleTracking(i)'>

                <div v-if='hasToolTip(i)'
                    class='cal-day-tooltip'>
                    {{ getToolTip(i) }}
                </div>
                {{ i }}
            </div>

            <div class='cal-day cal-day-inactive'
                v-for='i in endDay'
                :key='`${i}-blank-end`' />
        </div>
    </div>
</template>

<script>
import { DateMixins } from '../mixins/mixins';
export default {
    mixins: [DateMixins],
    props: {
        value: {
            type: Object,
            required: true
        },
        month: {
            type: Number,
            default: new Date().getMonth() + 1
        },
        next: {
            type: String,
            default: 'Next'
        },
        prev: {
            type: String,
            default: 'Prev'
        },
        year: {
            type: Number,
            default: new Date().getFullYear()
        },
        multiDaySelect: {
            type: Boolean,
            default: true
        },
        highlighted: {
            type: Object,
            default: {}
        }
    },
    data: () => ({
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        tracking: false,
        startDate: null,
        endDate: null,
        activeMonth: null,
        activeYear: null
    }),
    computed: {
        startDay() {
            return new Date(this.activeYear, this.activeMonth - 1, 1).getDay();
        },
        endDay() {
            return 6 - new Date(this.activeYear, this.activeMonth - 1, this.daysInMonth).getDay();
        },
        daysInMonth() {
            return new Date(this.activeYear, this.activeMonth, 0).getDate();
        },
        returnData() {
            return this.multiDaySelect
                ? {
                      start: this.startDate,
                      end: this.endDate
                  }
                : { day: this.startDate };
        },
    },
    created() {
        this.activeMonth = this.month || new Date().getMonth() + 1;
        this.activeYear = this.year || new Date().getFullYear();
        if (!this.month) {
            this.$emit('update:month', this.activeMonth);
        }
        if (!this.year) {
            this.$emit('update:year', this.activeYear);
        }
    },
    methods: {
        generatedClass(day) {
            let classes = [];
            let compareDate = new Date(this.activeYear, this.activeMonth - 1, day);
            if (this.startDate && compareDate.getTime() === this.startDate.getTime()) {
                classes.push('cal-day-clicked')
            } else if (this.endDate && compareDate.getTime() === this.endDate.getTime()) {
                 classes.push('cal-day-clicked')
            } else if (
                this.startDate &&
                this.endDate &&
                compareDate.getTime() > this.startDate.getTime() &&
                compareDate.getTime() < this.endDate.getTime()
            ) {
                 classes.push('cal-day-faded')
            }

            if (this.hasToolTip(day)) {
                classes.push('cal-day-highlighted')
            }

            return classes.join(' ');
        },
        handleTracking(day) {
            let newDate = new Date(this.activeYear, this.activeMonth - 1, day);
            if (!this.multiDaySelect) {
                this.initiateTracking(newDate, false);
            } else if (!this.tracking) {
                this.initiateTracking(newDate);
            } else if (newDate.getTime() >= this.startDate.getTime()) {
                this.finalizeTracking(newDate);
            } else if (newDate.getTime() < this.startDate.getTime()) {
                let newEnd = this.startDate;
                this.initiateTracking(newDate);
                this.finalizeTracking(newEnd);
            }

            this.$emit('input', this.returnData);
        },
        initiateTracking(start, tracking = true) {
            this.startDate = start;
            this.endDate = null;
            this.tracking = tracking;
        },
        finalizeTracking(end) {
            this.endDate = end;
            this.tracking = false;
        },
        prevMonth() {
            this.activeMonth--;
            if (this.activeMonth <= 0) {
                this.activeMonth = 12;
                this.activeYear--;
            }
            this.$emit('update:month', this.activeMonth);
            this.$emit('update:year', this.activeYear);
        },
        nextMonth() {
            this.activeMonth++;
            if (this.activeMonth > 12) {
                this.activeMonth = 1;
                this.activeYear++;
            }
            this.$emit('update:month', this.activeMonth);
            this.$emit('update:year', this.activeYear);
        },
        hasToolTip(day) {
            return Object.keys(this.highlighted).includes(this.formattedString(day))
        },
        getToolTip(day) {
            const t = this.highlighted[this.formattedString(day)]
            return t && t.name || ''
        },
        formattedString(day) {
            const lp = str => `${str}`.length === 1 ? `0${str}` : `${str}`;
            return `${lp(day)}-${lp(this.activeMonth)}-${this.activeYear}`
        },
    },
    watch: {
        year(newVal, oldVal) {
            this.activeYear = newVal;
        },
        month(newVal, oldVal) {
            this.activeMonth = newVal;
        },
        value(val) {
            if (this.multiDaySelect) {
                this.startDate = val.start;
                this.endDate = val.end;
            } else {
                this.startDate = val.day;
                this.endDate = null;
            }
        }
    }
};
</script>

