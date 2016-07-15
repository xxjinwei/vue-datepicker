;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Datepicker = factory();
  }
}(this, function() {
/**!
 * @file vue-datepicker
 * @author jinwei01
 */

function getSizeOfMonth (month, year) {
    var isLeapYear = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0
    return [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
}

function zeroPad (str, len) {
    len = len || 2
    return ('0000' + str).slice(-len)
}

function parseDate (dateString) {
    var d
    d = dateString instanceof Date ? dateString: new Date(dateString)
    return new Date([d.getFullYear(), d.getMonth() + 1, d.getDate()].join('/'))
}

function parseDateString (date, format) {
    var date = parseDate(date)
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

// today
var TODAY = parseDate(new Date)

var idCounter    = 0

var defaultConf = {
    format   : 'yyyy/mm/dd',
    yearrange: [2000, 2020],

    i18n  : {
        yearunit   : '年',
        months     : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        week       : ['日', '一', '二', '三', '四', '五', '六'],
        totodaytext: '今天'
    }
}

// user vue-transfer-dom plugin
Vue.use(VueTransferDom)

Vue.component('date-picker', {
    template: "<div class=\"datepicker-group\" @click=\"markEventFromPicker\" :class=\"{disabled:disabled}\" id=\"{{uid}}\">\n    <input @click=\"isshow = true\" value=\"{{value}}\" :disabled=\"disabled\" readonly=\"readonly\">\n    <i class=\"datepicker-icon\" @click=\"disabled || (isshow = !isshow)\"></i>\n</div>\n<div class=\"datepicker\" v-show=\"isshow\" v-click-outside=\"clickOutside\" @click=\"markEventFromPicker\" :style=\"style\" v-transfer-dom>\n    <div class=\"datepicker-header\">\n        <i class=\"datepicker-prev-year\" @click=\"year <= minYear || year--\" :class=\"{disabled: year <= minYear}\"></i> <!-- prev year -->\n        <i class=\"datepicker-prev-month\" @click=\"(year <= minYear && month <= 0) || setMonth(month - 1)\" :class=\"{disabled: year <= minYear && month <= 0}\"></i> <!-- prev month -->\n        <div class=\"datepicker-select datepicker-year\"> <!-- year select -->\n            <label>{{year + yearunit}}</label>\n            <select v-model=\"year\" number>\n                <option v-for=\"(index, item) in years\" value=\"{{item}}\" selected=\"{{$value == year}}\">{{item + yearunit}}</option>\n            </select>\n        </div>\n        <div class=\"datepicker-select datepicker-month\"> <!-- month select -->\n            <label>{{months[month]}}</label>\n            <select v-model=\"month\" number>\n                <option v-for=\"m in months\" value=\"{{$index}}\" selected=\"{{$value == month}}\">{{m}}</option>\n            </select>\n        </div>\n        <i class=\"datepicker-next-month\" @click=\"(year >= maxYear && month >= 11) || setMonth(month + 1)\" :class=\"{disabled: year >= maxYear && month >= 11}\"></i> <!-- next month -->\n        <i class=\"datepicker-next-year\" @click=\"year >= maxYear || year++\" :class=\"{disabled: year >= maxYear}\"></i> <!-- next year -->\n    </div>\n    <table class=\"datepicker-calendar\">\n        <thead>\n            <tr class=\"datepicker-dayofweek\">\n                <th v-for=\"w in week\">{{w}}</th>\n            </tr> <!-- week -->\n        </thead>\n        <tbody class=\"datepicker-days\">\n            <tr v-for=\"row in dates\">\n                <td v-for=\"cell in row\"\n                    :class=\"{istoday: cell.istoday, selected: cell.selected || (date === cell.value && month === selectedMonth && year === selectedYear), disabled: cell.disabled}\"\n                    @click=\"cell.disabled || selectDate(cell.value)\">\n                    {{cell.text}}\n                </td>\n            </tr>\n        </tbody> <!-- grid -->\n        <tfoot>\n            <tr>\n                <td colspan=\"7\"><span class=\"datepicker-today\" @click=\"toToday\">{{totodaytext}}</span></td> <!-- to today -->\n            </tr>\n        </tfoot>\n    </table>\n</div>\n",
    props: {
        isshow   : false,
        theme    : '',
        value    : '',
        mindate  : '',
        format   : {default: defaultConf.format},
        yearunit : {default: defaultConf.i18n.yearunit},
        yearrange: {
            type   : Array,
            default: function () {
                return defaultConf.yearrange
            }
        },
        months: {
            coerce : function (months) {
                return Array.isArray(months) ? months : JSON.parse(months.replace(/\'/g, '"'))
            },
            default: function () {
                return defaultConf.i18n.months
            }
        },
        week: {
            coerce : function (days) {
                return Array.isArray(days) ? days : JSON.parse(days.replace(/\'/g, '"'))
            },
            default: function () {
                return defaultConf.i18n.week
            }
        },
        totodaytext: {default: defaultConf.i18n.totodaytext},
        disabled   : false
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
            style: {}
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

            var firstDayOfMonth = parseDate([this.year, this.month + 1, '1'].join('/')).getDay()

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
                    cell.disabled = this.minDate && parseDate([this.year, this.month + 1, dateIndex].join('/')) < this.minDate

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
            }
        }
    },
    beforeCompile: function () {
        this.selected = this.value && parseDate(this.value)
        this.value    = this.value && this.formatDate(this.value)
        this.minDate  = this.mindate && parseDate(this.mindate)
    },
    ready: function () {
        var rect = document.getElementById(this.uid).getBoundingClientRect()
        this.style = {
            left: rect.left + 'px',
            top : rect.bottom + 'px'
        }
    },
    methods: {
        setDate: function (date) {
            this.selected = this.minDate ? parseDate(Math.max(this.minDate, parseDate(date))): parseDate(date)
        },
        setMindate: function (date) {
            this.minDate = parseDate(date)
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
            this.selected = parseDate([this.year, this.month + 1, this.date].join('/'))
        },
        toToday: function () {
            this.year  = TODAY.getFullYear()
            this.month = TODAY.getMonth()
        },
        formatDate: function (date) {
            return date && parseDateString(date, this.format)
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
        document.addEventListener('click', function () {
            var vm = me.vm
            vm.isshow && !vm.clickFromPicker && (vm.isshow = false)
        })
    }
})

return Datepicker;
}));