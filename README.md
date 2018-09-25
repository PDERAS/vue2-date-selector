# Vue Date Selector
A collection of vue 2 components for selecting a date. `<date-selector>` provides 3 input boxes for an easy way to select the day, month, and year. `<calendar-picker>` displays a calendar to select an individual date, or a start and end date.

## How to initialize Vue Date Selector
Vue date selector is built as a vue plugin. It can be initialized just as the Vue documentation states.

```javascript
import DateSelector from "@pderas/vue2-date-selector";

// this provides access to both <date-selector /> and <calendar-picker /> components globally
Vue.use(DateSelector);
```
## Usage

#### `<date-selector />` Creation
Vue date selector is easily created, and has many properties that can be changed.

```HTML
<date-selector></date-selector>

```

## `<date-selector />` Properties
| Property      | Required | Type             | Default                    | Description                                                             |
|---------------|:--------:|------------------|----------------------------|-------------------------------------------------------------------------|
| value         | false    | String&#124;Date | Date()                     | Value for the input, can be used with v-model                           |
| formatFn      | false    | Function         | (value) => {return value } | Formats the labels based on the function provided                       |
| amountOfYears | false    | Number           | 20                         | The amount of years to show in the date selector, from the current year |
| amountOfYearsAfter | false    | Number           | 0                         | The amount of years to show in the date selector, from after the current year |
| disabled      | false    | Object           | null                       | Specifies dates to disable from being selected in the picker            |
| disabledInput | false    | Boolean          | false                      | Disables the inputs on the date selector                                |

### Disabled Dates
The disabled object contains two potential keys for disabling ranges of dates.

* `to` This is used for disabling dates up to a specific date.
* `from` This is used for disabled dates after a specific date.

Currently only `to` or `from` can be used separately. They cannot be used together. The value can be either a valid date string or a date object.

#### Styling
Styling is currently limited, but can be expanded in the future.

#### `<calendar-picker />` Creation
Vue calendar picker is easily created, and has many properties that can be changed.

```HTML
<calendar-picker v-model='dates' />
```

### `<calendar-picker />` Properties
| Property | Required | Type | Default | Description |
|--|--|--|--|--|
| value | true | Object | -- | passed in the form of either `{ day: null }` for single date picking, or `{ start: null, end: null }` for multi day picking |
| month | false | Number | `new Date().getMonth() + 1` | _**ones based**_ month to be displayed (Jan = 1, Dec = 12) |
| year | false | Number | `new Date().getFullYear()` | year to be displayed |
| multiDaySelect | false | Boolean | True | Allow either single, or multi day selection |
| next | false | String | `Next` | string to be displayed for next month button |
| prev | false | String | `Prev` | string to be displayed for previous month button |
| highlighted | false | Object | `{}` | days that should be highlighted on load. can include tooltip information to be displayed on hover. should be passed in the format `{ [dd-MM-yyyy]: { name: 'My Tooltip Info' }}`. for example:
```js
{
    "28-09-2018": {
        name: "last friday in september"
    },
    "01-10-2018": {
        name: "first monday in october"
    }
}
```

### Misc
Instead of providing a `value` prop, `v-model` can be used to make use of two way data binding. Similarly, the `month` and `year` props can be bound using the `.sync` modifier.
```html
<!-- sync example -->
<calendar-picker
    v-model='selectedDates'
    :month.sync='month'
    :year.sync='year' />
```


### Styling
All elements are namespaced starting with `.cal` and are written at the root level for the easiest customization. The calendar will grow/shrink width in relation to the surrounding div, and the squares height can be easily overwritten using `.cal-day { height: 50px; }`. The most common styles to be overridden are likely to be the background colors of: `.cal-header, .cal-inactive, .cal-today, .cal-highlighted, .cal-clicked, .cal-faded`.

![calendar-picker component](https://raw.githubusercontent.com/PDERAS/vue2-date-selector/calendar-picker/assets/calendar-picker.png)

## License
This project is covered under the MIT License. Feel free to use it wherever you like.
