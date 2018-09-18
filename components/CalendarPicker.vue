<template>
         <div>
            <div class="title">
                <h1>{{ year }} - {{ month }}</h1>
            </div>
            <div class="cal">
                <div class='cal-day cal-day-inactive' v-for='day in weekdays' :key='day'>{{ day }}</div>
                <div class='cal-day cal-day-inactive' v-for='i in startDay' :key='`${i}-blank-start`' />

                <div
                    class='cal-day'
                    v-for='i in daysInMonth'
                    :key='i'
                    :class='trackingBasedClass(i)'
                    @click='handleTracking(i)'>
                    {{ i }}
                </div>

                <div class='cal-day cal-day-inactive' v-for='i in endDay' :key='`${i}-blank-end`' />
            </div>
        </div>
</template>

<script>
export default {
    props: {
        year: {
            type: Number,
            default: new Date().getFullYear()
        },
        month: {
            type: Number,
            default: new Date().getMonth()
        },
        daysInMonth: {
            type: Number,
            default: new Date().getDate()
        }
    },
    data: () => ({
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        multiDaySelect: true,
        tracking: false,
        startDate: null,
        endDate: null
    }),
    computed: {
        startDay() {
            return new Date(this.year, this.month - 1, 1).getDay();
        },
        endDay() {
            return 6 - new Date(this.year, this.month - 1, this.daysInMonth).getDay();
        }
    },
    methods: {
        trackingBasedClass(day) {
            let compareDate = new Date(this.year, this.month - 1, day);
            if (this.startDate && compareDate.getTime() === this.startDate.getTime()) {
                return 'cal-day-clicked'
            } else if (this.endDate && compareDate.getTime() === this.endDate.getTime()) {
                return 'cal-day-clicked'
            } else if (this.startDate && this.endDate && compareDate.getTime() > this.startDate.getTime() && compareDate.getTime() < this.endDate.getTime()) {
                return 'cal-day-faded'
            }

            return ''
        },
        handleTracking(day) {
            let newDate = new Date(this.year, this.month - 1, day);
            if (!this.multiDaySelect) {
                this.startDate = newDate
                this.endDate = null
                this.tracking = false;
            } else if (!this.tracking) {
                this.startDate = newDate
                this.endDate = null
                this.tracking = true;
            } else if (newDate.getTime() >= this.startDate.getTime()) {
                this.endDate = newDate
                this.tracking = false;
            }
        }
    }
}
</script>

