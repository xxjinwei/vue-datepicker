# vue-datepicker
baidu-style datepicker by vue

## how to use

### dependencies

1. ```dist/datepicker.css```

2. ```vue-transfer-dom.js```

### use

```hmtl
<date-picker></date-picker>
```

### setting

1:
```html
<date-picker
    months="['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec']"
    week="['Sun','Mon','Tue','Wed','Thu','Fri','Sat']"
    yearrange="[1990, 2040]"
    totodaytext="toToday"
    format="yyyy-mm-dd"
    yearunit=""
    value="2016/07/15"
    mindate="2016/07/10"
    >
</date-picker>
```

2:
```html
<date-picker :conf="datepickerConf"></date-picker>
```
```js
var vm = new Vue({
    el: 'body',
    data: {
        datepickerConf: {
            months     : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            week       : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
            yearunit   : '',
            yearrange  : [2008, 2016],
            totodaytext: '跳到今天',
            format     : 'yyyy.mm.dd',
            value      : '2016/7/12',
            mindate    : '2016/7/4'
        }
    }
})
```


### methods

```html
<date-picker v-ref:dp1></date-picker>
```
```js
var picker = vm.$refs.dp1

picker.setDate('2016/7/7')

pickr.setMindate('2016/7/7')

picker.getDate() // return Date

picker.getDateString() // return string

picker.disable() // disabled the picker
```
