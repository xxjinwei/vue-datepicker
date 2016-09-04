;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./vue', './datepicker'], factory)
  } else if (typeof exports === 'object') {
    factory(require('./vue'), require('./datepicker'))
  } else {
    factory(root.Vue, root.DatePicker)
  }
}(this, function(Vue, DatePicker) {
/**
 * @file datepicker range
 * @author jinwei01
 */

var oneDay = 24 * 60 * 60 * 1000

var template = [
    '<date-picker :conf="startConf"></date-picker>',
    '<span class="datepicker-delimitor">-</span>',
    '<date-picker :conf="endConf"></date-picker>'
].join('')

var DatePickerRange = Vue.extend({
    template: template,
    props: {
        interval : {
            default: 0,
            type: Number,
            coerce: function (num) {
                return Number(num)
            }
        },
        startDate: {},
        endDate  : {},
        minDate  : {},
        maxDate  : {},
        conf: {
            default: function () {
                return {}
            }
        }
    },
    data : function () {
        return {
            startConf: {
                onPick: function (selected) {
                    var parent = this.$parent
                    var endPicker = parent.endPicker
                    endPicker.setMindate(this.parseDate(selected * 1 + parent.interval * oneDay))
                    parent.onPick.call(parent, parent.getDate())
                }
            },
            endConf: {
                onPick: function () {
                    var parent = this.$parent
                    parent.onPick.call(parent, parent.getDate())
                }
            },
            onPick : noop
        }
    },
    beforeCompile: function () {
        var conf      = this.conf
        var startConf = this.startConf
        var endConf   = this.endConf

        this.startDate && (startConf.value = this.startDate)
        this.endDate && (endConf.value     = this.endDate)

        // interval
        if (conf.interval) {
            this['interval'] = conf.interval
            Vue.delete(conf, 'interval')
        }
        // onPick
        if (conf.onPick) {
            this['onPick'] = conf.onPick
            Vue.delete(conf, 'onPick')
        }

        Object.keys(conf).forEach(function (item) {
            startConf[item] = conf[item]
            endConf[item]   = conf[item]
        })

        // start date
        if (startConf.startDate) {
            startConf.value = startConf.startDate
            Vue.delete(startConf, 'startDate')
        }

        // end date
        if (endConf.endDate) {
            endConf.value = endConf.endDate
            Vue.delete(endConf, 'endDate')
        }

        // maxDate
        var max = conf.maxDate || this.maxDate
        // minDate
        var min = conf.minDate || this.minDate

        if (max) {
            startConf.maxdate = parseDate(max) * 1 - this.interval * oneDay
            endConf.maxdate   = max
        }

        if (min) {
            startConf.mindate = min
            endConf.mindate   = parseDate(min) * 1 + this.interval * oneDay
        }
    },
    ready: function () {
        this.startPicker = this.$children[0]
        this.endPicker   = this.$children[1]
    },

    methods: {
        getDate: function () {
            return {
                start: this.startPicker.getDate(),
                end  : this.endPicker.getDate() && new Date(this.endPicker.getDate() * 1 + oneDay - 1000)
            }
        },
        getDateString: function () {
            return {
                start: this.startPicker.getDateString(),
                end  : this.endPicker.getDateString()
            }
        }
    }
})

Vue.component('date-range-picker', DatePickerRange)


function parseDate (dateString) {
    var d
    d = dateString instanceof Date ? dateString: new Date(dateString)
    return new Date([d.getFullYear(), d.getMonth() + 1, d.getDate()].join('/'))
}

function noop () {}

return DatePickerRange;
}))
