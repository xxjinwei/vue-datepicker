;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./vue-transfer-dom'], factory)
  } else if (typeof exports === 'object') {
    factory(require('./vue-transfer-dom'))
  } else {
    factory(root.VueTransferDom)
  }
}(this, function(VueTransferDom) {
/**!
 * @file vue-datepicker
 * @author jinwei01
 */

// today
var TODAY = parse(new Date)

var idCounter = 0

var defaultConf = {
    format   : 'yyyy/mm/dd',
    yearrange: [2000, 2020],

    // i18n
    yearunit   : '年',
    months     : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    week       : ['日', '一', '二', '三', '四', '五', '六'],
    totodaytext: '今天'
}

// use vue-transfer-dom plugin
Vue.use(VueTransferDom)

var DatePicker = Vue.extend({
    template: "<div class=\"datepicker-group\" @click=\"markEventFromPicker\" :class=\"{disabled:disabled}\" id=\"{{uid}}\">\n    <input @click=\"isshow = true\" value=\"{{value}}\" :disabled=\"disabled\" readonly=\"readonly\">\n    <i class=\"datepicker-icon\" @click=\"disabled || (isshow = !isshow)\"></i>\n</div>\n<template v-if=\"!disabled\">\n<div class=\"datepicker\" v-show=\"isshow\" v-click-outside=\"clickOutside\" @click=\"markEventFromPicker\" :style=\"style\" v-transfer-dom>\n    <div class=\"datepicker-header\">\n        <i class=\"datepicker-prev-year\" @click=\"year <= minYear || year--\" :class=\"{disabled: year <= minYear}\"></i> <!-- prev year -->\n        <i class=\"datepicker-prev-month\" @click=\"(year <= minYear && month <= 0) || setMonth(month - 1)\" :class=\"{disabled: year <= minYear && month <= 0}\"></i> <!-- prev month -->\n        <div class=\"datepicker-select datepicker-year\"> <!-- year select -->\n            <label>{{year + yearunit}}</label>\n            <select v-model=\"year\" number>\n                <option v-for=\"(index, item) in years\" value=\"{{item}}\" selected=\"{{$value == year}}\">{{item + yearunit}}</option>\n            </select>\n        </div>\n        <div class=\"datepicker-select datepicker-month\"> <!-- month select -->\n            <label>{{months[month]}}</label>\n            <select v-model=\"month\" number>\n                <option v-for=\"m in months\" value=\"{{$index}}\" selected=\"{{$value == month}}\">{{m}}</option>\n            </select>\n        </div>\n        <i class=\"datepicker-next-month\" @click=\"(year >= maxYear && month >= 11) || setMonth(month + 1)\" :class=\"{disabled: year >= maxYear && month >= 11}\"></i> <!-- next month -->\n        <i class=\"datepicker-next-year\" @click=\"year >= maxYear || year++\" :class=\"{disabled: year >= maxYear}\"></i> <!-- next year -->\n    </div>\n    <table class=\"datepicker-calendar\">\n        <thead>\n            <tr class=\"datepicker-dayofweek\">\n                <th v-for=\"w in week\">{{w}}</th>\n            </tr> <!-- week -->\n        </thead>\n        <tbody class=\"datepicker-days\">\n            <tr v-for=\"row in dates\">\n                <td v-for=\"cell in row\"\n                    :class=\"{istoday: cell.istoday, selected: cell.selected || (date === cell.value && month === selectedMonth && year === selectedYear), disabled: cell.disabled}\"\n                    @click=\"cell.value && !cell.disabled && selectDate(cell.value)\">{{cell.text}}</td>\n            </tr>\n        </tbody> <!-- grid -->\n        <tfoot>\n            <tr>\n                <td colspan=\"7\"><span class=\"datepicker-today\" @click=\"toToday\">{{totodaytext}}</span></td> <!-- to today -->\n            </tr>\n        </tfoot>\n    </table>\n</div>\n</template>\n",
    props: {
        isshow   : {},
        value    : {},
        mindate  : {},
        format   : {default: defaultConf.format},
        yearunit : {default: defaultConf.yearunit},
        yearrange: {
            coerce : function (months) {
                return Array.isArray(months) ? months : JSON.parse(months.replace(/\'/g, '"'))
            },
            default: function () {
                return defaultConf.yearrange
            }
        },
        months: {
            coerce : function (months) {
                return Array.isArray(months) ? months : JSON.parse(months.replace(/\'/g, '"'))
            },
            default: function () {
                return defaultConf.months
            }
        },
        week: {
            coerce : function (days) {
                return Array.isArray(days) ? days : JSON.parse(days.replace(/\'/g, '"'))
            },
            default: function () {
                return defaultConf.week
            }
        },
        totodaytext: {default: defaultConf.totodaytext},
        disabled   : {
            type: Boolean
        },
        conf: {default: function () {return {}}}
    },
    data: function () {
        return {
            year : TODAY.getFullYear(),
            month: TODAY.getMonth(),

            minYear: this.yearrange[0],
            maxYear: this.yearrange[1],

            minDate: undefined,

            selected     : undefined,
            selectedYear : undefined,
            selectedMonth: undefined,
            selectedDate : undefined,

            uid  : 'dp__' + idCounter++,
            style: {left: undefined, top: undefined},

            onPick: noop
        }
    },
    computed: {
        years: function () {
            var start = this.minYear
            var end   = this.maxYear
            var index = start
            var years = []
            while (index <= end) {
                years.push(index++)
            }
            return years
        },
        dates: function () {
            var dateCells = [];
            var dateSize  = getSizeOfMonth(this.month, this.year)
            var cellSize  = 7 * 6

            var firstDayOfMonth = this.parseDate([this.year, this.month + 1, '1'].join('/')).getDay()

            var dateIndex = 1
            var rowIndex  = 1

            var row = []
            var cell

            var curYear  = TODAY.getFullYear()
            var curMonth = TODAY.getMonth()
            var curDate  = TODAY.getDate()

            var selectedDate = this.selected && this.selected.getDate()

            for (var i = 0; i < cellSize; i++) {
                cell = {}
                if (i >= firstDayOfMonth && dateIndex <= dateSize) {

                    cell.value = dateIndex
                    cell.text  = cell.value
                    // today
                    cell.istoday = curYear === this.year && curMonth === this.month && curDate === dateIndex
                    // selected
                    cell.selected = this.selectedYear === this.year && this.selectedMonth === this.month && selectedDate === dateIndex
                    // disabled
                    cell.disabled = this.minDate && this.parseDate([this.year, this.month + 1, dateIndex].join('/')) < this.minDate

                    dateIndex++
                }

                row.push(cell)

                if (i === 7 * rowIndex - 1) {
                    dateCells.push(row)
                    rowIndex++
                    row = []
                }
            }

            return dateCells
        }
    },
    watch: {
        minDate: function (newMindate) {
            if (newMindate && newMindate > this.getDate()) {
                this.selected = newMindate
            }
        },
        selected: function (newDate) {
            if (newDate) {
                this.select        = newDate
                this.year          = newDate.getFullYear()
                this.month         = newDate.getMonth()
                this.date          = newDate.getDate()
                this.selectedYear  = newDate.getFullYear()
                this.selectedMonth = newDate.getMonth()
                this.value         = this.formatDate(newDate)

                // trigger select callback
                this.onPick.call(this, this.selected)
            }
        },
        yearrange: function (newRange) {
            this.minYear = newRange[0]
            this.maxYear = newRange[1]
        },
        isshow: function (newIsshow) {
            newIsshow  && Vue.nextTick(function(){
                this.setPosition()
            }, this)
        }
    },
    beforeCompile: function () {
        var me   = this
        var conf = this.conf

        if (conf) {
            Object.keys(conf).forEach(function (item) {
                me[item] = conf[item]
            })
        }

        this.selected = this.value && this.parseDate(this.value)
        this.value    = this.value && this.formatDate(this.value)
        this.minDate  = this.mindate && this.parseDate(this.mindate)
    },
    compiled: function () {
        this._input = this._fragment.getElementById(this.uid)
        this._input.removeAttribute('id')
        Vue.delete(this, 'uid')
    },
    ready: function () {
        this.disabled || this.setPosition()
    },
    methods: {
        setDate: function (date) {
            this.selected = this.minDate ? this.parseDate(Math.max(this.minDate, this.parseDate(date))): this.parseDate(date)
        },
        setMindate: function (date) {
            this.minDate = this.parseDate(date)
        },
        getDate: function () {
            return this.selected
        },
        getDateString: function () {
            return this.value
        },
        disable: function () {
            return this.disabled = true
        },
        enable: function () {
            return this.disabled = false
        },
        setMonth: function (month) {
            if (month < 0) {
                month = 11
                this.year--
            } else if (month > 11) {
                month = 0
                this.year++
            }
            this.month = month
        },
        selectDate: function (date) {
            this.date     = date
            this.selected = this.parseDate([this.year, this.month + 1, this.date].join('/'))
        },
        toToday: function () {
            this.year  = TODAY.getFullYear()
            this.month = TODAY.getMonth()
        },
        parseDate: parse.bind(null),
        formatDate: function (date) {
            return date && format(date, this.format)
        },
        setPosition: function () {
            var rect = this._input.getBoundingClientRect()
            this.style.left = rect.left + 'px'
            this.style.top  = (rect.bottom + window.scrollY) + 'px'
        },
        markEventFromPicker: function () {
            var me = this
            this.clickFromPicker = true
            setTimeout(function () {
                me.clickFromPicker = false
            }, 0)
        }
    }
})

Vue.directive('click-outside', {
    bind: function () {
        var me = this
        Vue.util.on(document, 'click', function () {
            var vm = me.vm
            vm.isshow && !vm.clickFromPicker && (vm.isshow = false)
        })
    }
})


Vue.component('date-picker', DatePicker)



function getSizeOfMonth (month, year) {
    var isLeapYear = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0
    return [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
}

function zeroPad (str, len) {
    len = len || 2
    return ('0000' + str).slice(-len)
}

function parse (dateString) {
    var d
    d = dateString instanceof Date ? dateString: new Date(dateString)
    return new Date([d.getFullYear(), d.getMonth() + 1, d.getDate()].join('/'))
}

function format (date, format) {
    var date = parse(date)
    var map = {
        'm': date.getMonth() + 1,
        'd': date.getDate()
    }

    return format.toLowerCase().replace(/([ymd])+/g, function(match, p){
        var v   = map[p]
        var ret = match
        if (v) {
            ret = zeroPad(v, match.length)
        } else {
            if (p === 'y') {
                ret = (date.getFullYear() + '').substr(4 - match.length)
            }
        }
        return ret
    })
}
function noop () {}

return DatePicker;
}))
