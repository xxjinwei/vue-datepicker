# vue-datepicker-range
baidu-style datepicker-range by vue

Try the [demo](https://xxjinwei.github.io/vue-datepicker/)

## How to use

### dependencies

1. dist/datepicker.css

2. vue-datepicker.js

### use

```hmtl
<date-picker-range></date-picker-range>
```
默认间隔（interval）0天，即start picker 和 end picker 可选同一天

end picker 的取值为当天最后一秒

### setting

1:
```html
<date-range-picker start-date="2016/7/7" end-date="2016/7/11"></date-range-picker>
```

2:
```html
<date-range-picker :conf="rangeConf" v-ref:range2></date-range-picker>
```
```js
var vm = new Vue({
    el: 'body',
    data: {
        rangeConf: {
            interval : 4, // 间隔天数
            startDate: '2016/7/7',
            endDate  : '2016/7/14',

            // 以下属性参考datepicker,  同时作用于start picker 和 end picker
            months     : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            week       : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
            yearunit   : '',
            yearrange  : [2008, 2016],
            totodaytext: '跳到今天',
            format     : 'yyyy.mm.dd',
            value      : '2016/7/12',
            mindate    : '2016/7/4',
            onPick     : function (selected) {
                console.log(selected)
            }
        }
    }
})
```


### methods

```html
<date-picker-range v-ref:dp1></date-picker-range>
```
```js
var picker = vm.$refs.dp1

picker.getDate() // {start: Date,  end: Date}

picker.getDateString() // {start: string, end: string}

// start picker
picker.startPicker
// end picker
picker.endPicker

// 参考datepicker
picker.startPicker.setDate('2016/7/7')

picker.startPicker.setMindate('2016/7/7')

picker.startPicker.getDate() // return Date

picker.startPicker.getDateString() // return string

picker.startPicker.disable() // disabled the picker




```
