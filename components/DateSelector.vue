<template>
    <div>
        <div id="date-selector-month">
            <select :value="month"
                    @change="update($event, 'm')"
                    id="birthday-m"
                    class="form-control"
                    name="birthday-m"
                    required>
                <option disabled :value="null" selected>formatLabel('Month')</option>
                <option value="1">formatLabel('Jan')</option>
                <option value="2">formatLabel('Feb')</option>
                <option value="3">formatLabel('Mar')</option>
                <option value="4">formatLabel('Apr')</option>
                <option value="5">formatLabel('May')</option>
                <option value="6">formatLabel('Jun')</option>
                <option value="7">formatLabel('Jul')</option>
                <option value="8">formatLabel('Aug')</option>
                <option value="9">formatLabel('Sep')</option>
                <option value="10">formatLabel('Oct')</option>
                <option value="11">formatLabel('Nov')</option>
                <option value="12">formatLabel('Dec')</option>
            </select>
        </div>
        <div id="date-selector-day">
            <select :value="day"
                    @change="update($event, 'd')"
                    id="birthday-d"
                    class="form-control"
                    name="birthday-d"
                    required>
                <option disabled :value="null" selected>formatLabel('Day')</option>
                <option v-for="d in days" :value="d">{{ d }}</option>
            </select>
        </div>
        <div id="date-selector-year">
            <select :value="year"
                    @change="update($event, 'y')"
                    id="birthday-y"
                    class="form-control"
                    name="birthday-y"
                    required>
                <option disabled :value="null" selected>formatLabel('Year')</option>
                <option v-for="year in years" :value="year">{{ year }}</option>
            </select>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'date-selector',

        props: {
            amountOfYears: {
                type:       [ String, Number ],
                default:    20,
                validator:  function(val) {
                    return Number(val);
                }
            },

            useUpperCase: {
                type: Boolean,
                default: false
            },

            value: {
                default:    function() { new Date() },
                validator:  function(val) {
                    return String(val) || val instanceof Date;
                }
            }
        },

        data: function() {
            return {
                day:    null,
                month:  null,
                year:   null
            }
        },

        mounted: function() {
            if (this.value && !(this.value instanceof Date)) {
                var date = this.value.split(' ')[0];
                this.day = Number(date.split('-')[2]);
                this.month = Number(date.split('-')[1]);
                this.year = Number(date.split('-')[0]);
            } else if (this.value && (this.value instanceof Date)) {
                this.day = Number(this.value.getDate());
                this.month = Number(this.value.getMonth() + 1);
                this.year = Number(this.value.getFullYear());
            }
        },

        computed: {
            days: function() {
                var thirtyOneDayMonths = [1, 3, 5, 7, 8, 10, 12];
                var thirtyDayMonths = [4, 6, 9, 11];

                if (this.month) {
                    if (thirtyOneDayMonths.indexOf(this.month) > -1) {
                        return 31;
                    } else if (thirtyDayMonths.indexOf(this.month) > -1) {
                        return 30;
                    } else {
                        if (this.year && (this.year % 4 == 0)) {
                            return 29;
                        } else {
                            return 28;
                        }
                    }
                } else {
                    return 31;
                }
            },

            years: function() {
                var years = [];
                var currentYear = new Date();
                for (var yyyy = currentYear.getFullYear(); yyyy >= currentYear.getFullYear() - this.amountOfYears; yyyy--) {
                    years.push(yyyy);
                }

                return years;
            }
        },

        methods: {
            formatLabel: function(label) {
                return this.useUpperCase ? label.toUpperCase() : label;
            },

            update: function(e, type) {
                switch (type) {
                    case 'd':
                        this.day = Number(e.target.value);
                        break;
                    case 'm':
                        this.month = Number(e.target.value);
                        break;
                    case 'y':
                        this.year = Number(e.target.value);
                        break;
                }
                var date = this.year + '-' + this.month + '-' + this.day + ' 00:00:00';
                this.$emit('input', date);
            }
        }
    }
</script>

<style lang="scss">
    #date-selector-year {
        width: 33.333333%;
        float: left;
    }

    #date-selector-month {
        width:          33.333333%;
        margin-right:   4%;
        float:          left;
    }

    #date-selector-day {
        width:          25%;
        margin-right:   4%;
        float:          left;
    }
</style>
