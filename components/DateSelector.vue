<template>
    <div>
        <div class="date-selector-month">
            <select class="form-control"
                    id="birthday-m"
                    name="birthday-m"
                    :disabled="disabledInput"
                    :value="month"
                    @change="update($event, 'm')"
                    required>
                <option :value="null" disabled selected>{{ formatLabel('Month') }}</option>
                <option v-for="m in months" :value="m.val" :key="m.val">{{ formatLabel(m.label) }}</option>
            </select>
        </div>
        <div class="date-selector-day">
            <select class="form-control"
                    id="birthday-d"
                    name="birthday-d"
                    :disabled="disabledInput"
                    :value="day"
                    @change="update($event, 'd')"
                    required>
                <option :value="null" disabled selected>{{ formatLabel('Day') }}</option>
                <option v-for="day in days" :value="day" :key="day">{{ day }}</option>
            </select>
        </div>
        <div class="date-selector-year">
            <select class="form-control"
                    id="birthday-y"
                    name="birthday-y"
                    :disabled="disabledInput"
                    :value="year"
                    @change="update($event, 'y')"
                    required>
                <option :value="null" disabled selected>{{ formatLabel('Year') }}</option>
                <option v-for="year in years" :value="year" :key="year">{{ year }}</option>
            </select>
        </div>
        <div class="date-selector-error" v-if="disabledError">
            {{ displayError }}
        </div>
    </div>
</template>

<script>
    import { DateMixins } from '../mixins/mixins'
    export default {
        mixins: [DateMixins],
        name: 'date-selector',

        props: {
            amountOfYearsAfter: {
                type: String|Number,
                default: 0,
                validator: val => !isNaN(val)
            },

            amountOfYears: {
                type: String|Number,
                default: 20,
                validator: val => !isNaN(val)
            },

            disabled: {
                type: Object,
                default: null
            },

            disabledInput: {
                type: Boolean,
                default: false
            },

            formatFn: {
                type: Function,
                default: val => val
            },

            value: {
                default: () => new Date(),
                validator: val => String(val) || val instanceof Date
            }
        },

        data: () => ({
            day:    null,
            month:  null,
            year:   null,
            disabledError: false
        }),

        mounted() {
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

            days() {
                var thirtyOneDayMonths = [1, 3, 5, 7, 8, 10, 12],
                    thirtyDayMonths = [4, 6, 9, 11],
                    days = 31;

                if (this.month) {
                    if (thirtyOneDayMonths.includes(this.month)) {
                        days = 31;
                    } else if (thirtyDayMonths.includes(this.month)) {
                        days = 30;
                    } else if (this.year && (this.year % 4 == 0)) {
                        days = 29;
                    } else {
                        days = 28;
                    }
                }

                var values = [];
                for (var i = 1; i <= days; i++) {
                    if (this.disabled) {
                        if (this.validate('day', i)) {
                            values.push(i);
                        } else if (this.day === i) {
                            this.day = null;
                            this.disabledError = true;
                        }
                    } else {
                        values.push(i);
                    }
                }

                return values;
            },

            displayError() {
                var error = '',
                    toDate,
                    fromDate;
                if (this.disabled.to) {
                     if (!(this.disabled.to instanceof Date)) {
                        toDate = this.disabled.to;
                    } else if ((this.disabled.to instanceof Date)) {
                        toDate = Number(this.disabled.to.getMonth() + 1) + '-' + this.disabled.to.getDate() + '-' + this.disabled.to.getFullYear();
                    }
                    error += 'Only dates after ' + toDate + ' are allowed.';
                }

                if (this.disabled.from) {
                    if (!(this.disabled.from instanceof Date)) {
                        fromDate = this.disabled.from;
                    } else if ((this.disabled.from instanceof Date)) {
                        fromDate = Number(this.disabled.from.getMonth() + 1) + '-' + this.disabled.from.getDate() + '-' + this.disabled.from.getFullYear();
                    }
                    error += 'Only dates before ' + fromDate + ' are allowed.';
                }

                return error;
            },

            months() {
                var values = [];
                for (var i = 0; i < this._allMonths.length; i++) {
                    if (this.disabled) {
                        if (this.validate('month', this._allMonths[i].val)) {
                            values.push(months[i]);
                        } else if (this.month === this._allMonths[i].val) {
                            this.month = null;
                            this.disabledError = true;
                        }
                    } else {
                        values.push(this._allMonths[i]);
                    }
                }

                return values;
            },

            years() {
                var years = [];
                var currentYear = new Date().getFullYear();
                if (this.amountOfYearsAfter > 0) {
                    for (var yyyy = currentYear + Number(this.amountOfYearsAfter); yyyy > currentYear; yyyy--) {
                        if (this.disabled) {
                            if (this.validate('year', yyyy)) {
                                years.push(yyyy);
                            } else if (this.year === yyyy) {
                                this.year = null;
                                this.disabledError = true;
                            }
                        } else {
                            years.push(yyyy);
                        }
                    }
                }

                for (var yyyy = currentYear; yyyy >= currentYear - this.amountOfYears; yyyy--) {
                    if (this.disabled) {
                        if (this.validate('year', yyyy)) {
                            years.push(yyyy);
                        } else if (this.year === yyyy) {
                            this.year = null;
                            this.disabledError = true;
                        }
                    } else {
                        years.push(yyyy);
                    }
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
                    val < this.destructuredDisabled.to[type]) {
                    valid = true;
                }

                if (this.destructuredDisabled.from &&
                    val > this.destructuredDisabled.from[type]) {
                    valid = true;
                }
                return valid;
            },

            formatLabel(label) {
                return this.formatFn(label);
            },

            update(e, type) {
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
                this.disabledError = false;
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
                    case 'month':
                        if (this.checkValidity(type, val) &&
                           ((this.destructuredDisabled.to && this.year === this.destructuredDisabled.to.year) ||
                            (this.destructuredDisabled.from && this.year === this.destructuredDisabled.from.year))) {
                            valid = false;
                        }
                        break;
                    case 'year':
                        valid  = !this.checkValidity(type, val)
                        break;
                }
                return valid;
            }
        }
    }
</script>

<style lang="scss">
    .date-selector {
        &-year {
            width: 33.333333%;
            float: left;
        }

        &-month {
            width:          33.333333%;
            margin-right:   4%;
            float:          left;
        }

        &-day {
            width:          25%;
            margin-right:   4%;
            float:          left;
        }

        &-error {
            font-size: 10px;
            color: #bf5329;
            margin-top: 1px;
            text-align: center;
        }
    }
</style>
