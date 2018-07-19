# Vue Date Selector
A vue 2 component for selecting a date as 3 input boxes

## How to initialize Vue Date Selector
Vue date selector is built as a vue plugin. It can be initialized just as the Vue documentation states.

```javascript
import DateSelector from "@pderas/vue2-date-selector";

Vue.use(DateSelector);
```
## Usage

#### Creation
Vue date selector is easily created, and has many properties that can be changed.

```HTML
<date-selector></date-selector>
```

## Properties
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

## License
This project is covered under the MIT License. Feel free to use it wherever you like.
