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
Vue moola is easily created, and has many properties that can be changed.

```HTML
<date-selector></date-selector>
```

## Properties
| Property      | Required | Type             | Default | Description                                                             |
|---------------|:--------:|------------------|---------|-------------------------------------------------------------------------|
| value         | false    | String&#124;Date | Date()  | Value for the input, can be used with v-model                           |
| amountOfYears | false    | Number           | 20      | The amount of years to show in the date selector, from the current year |

#### Styling
Styling is currently limited, but can be expanded in the future.

## License
This project is covered under the MIT License. Feel free to use it wherever you like.