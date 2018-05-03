<template>
    <div>
        <div id="date-selector-month">
            <select :value="month"
                    @change="update($event, 'm')"
                    id="birthday-m"
                    class="form-control"
                    name="birthday-m"
                    required>
                <option disabled :value="null" selected>{{ formatLabel('Month') }}</option>
                <option value="1">{{ formatLabel('Jan') }}</option>
                <option value="2">{{ formatLabel('Feb') }}</option>
                <option value="3">{{ formatLabel('Mar') }}</option>
                <option value="4">{{ formatLabel('Apr') }}</option>
                <option value="5">{{ formatLabel('May') }}</option>
                <option value="6">{{ formatLabel('Jun') }}</option>
                <option value="7">{{ formatLabel('Jul') }}</option>
                <option value="8">{{ formatLabel('Aug') }}</option>
                <option value="9">{{ formatLabel('Sep') }}</option>
                <option value="10">{{ formatLabel('Oct') }}</option>
                <option value="11">{{ formatLabel('Nov') }}</option>
                <option value="12">{{ formatLabel('Dec') }}</option>
            </select>
        </div>
        <div id="date-selector-day">
            <select :value="day"
                    @change="update($event, 'd')"
                    id="birthday-d"
                    class="form-control"
                    name="birthday-d"
                    required>
                <option disabled :value="null" selected>{{ formatLabel('Day') }}</option>
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
                <option disabled :value="null" selected>{{ formatLabel('Year') }}</option>
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

            disabled: {
                type: Object
            },

            formatFn: {
                type: Function,
                default: (val) =>  { return val; }
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
            if (this.value) {
                var converted = this.convertDate(this.value);
                var { day, month, year } = converted;
                this.day = day;
                this.month = month;
                this.year = year;
            }
        },

        computed: {
            destructuredDisabled() {
                var disabled = {};
                if (this.disabled.to) {
                    disabled.to = this.convertDate(this.disabled.to);
                }

                if (this.disabled.from) {
                    disabled.from = this.convertDate(this.disabled.from);
                }
                return disabled;
            },

            days: function() {
                var thirtyOneDayMonths = [1, 3, 5, 7, 8, 10, 12],
                    thirtyDayMonths = [4, 6, 9, 11],
                    days = 0;

                if (this.month) {
                    if (thirtyOneDayMonths.indexOf(this.month) > -1) {
                        days = 31;
                    } else if (thirtyDayMonths.indexOf(this.month) > -1) {
                        days = 30;
                    } else {
                        if (this.year && (this.year % 4 == 0)) {
                            days = 29;
                        } else {
                            days = 28;
                        }
                    }
                } else {
                    days = 31;
                }

                var values = [];
                if (this.disabled) {
                    // If a year or month is not selected all dates are valid
                    if (!this.year || !this.month) {
                        for (var i = 1; i <= days; i++) {
                            values.push(i);
                        }
                        return values;
                    };

                    for (var i = 1; i <= days; i++) {
                        if (this.validate('day', i)) {
                            values.push(i);
                        } else if (this.day === i) {
                            this.day = null;
                        }
                    }
                    return values;
                }

                for (var i = 1; i <= days; i++) {
                    values.push(i);
                }
                return values;
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
            convertDate(date) {
                var converted = {
                    day: null,
                    month: null,
                    year: null
                };

                if (!(date instanceof Date)) {
                    var temp = date.split(' ')[0];
                    converted.day = Number(temp.split('-')[2]);
                    converted.month = Number(temp.split('-')[1]);
                    converted.year = Number(temp.split('-')[0]);
                } else if ((date instanceof Date)) {
                    converted.day = Number(date.getDate());
                    converted.month = Number(date.getMonth() + 1);
                    converted.year = Number(date.getFullYear());
                }

                return converted;
            },

            checkValidity(type, val) {
                var valid = false;
                if (this.destructuredDisabled.to &&
                    val <= this.destructuredDisabled.to[type]) {
                    valid = true;
                }

                if (this.destructuredDisabled.from &&
                    val >= this.destructuredDisabled.from[type]) {
                    valid = true;
                }
                return valid;
            },

            formatLabel: function(label) {
                return this.formatFn(label);
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
            },

            validate(type, val) {
                var valid = true;
                switch (type) {
                    case 'day':
                        if (this.checkValidity(type, val) &&
                           ((this.destructuredDisabled.to &&
                            this.month === this.destructuredDisabled.to.month) ||
                            (this.destructuredDisabled.from &&
                             this.month === this.destructuredDisabled.from.month)) &&
                           ((this.destructuredDisabled.to && this.year === this.destructuredDisabled.to.year) ||
                            (this.destructuredDisabled.from && this.year === this.destructuredDisabled.from.year))) {
                            valid = false;
                            }
                        break;
                }
                return valid;
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
