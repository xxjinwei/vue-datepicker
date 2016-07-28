var idCounter = 0

var oneDay = 24 * 60 * 60 * 1000

var template = [
    '<date-picker :conf="startConf"></date-picker>',
    '<span class="datepicker-delimitor">-</span>',
    '<date-picker :conf="endConf"></date-picker>'
].join('')

var DatePickerRange = Vue.component('date-range-picker', {
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
        conf: {
            default: function () {
                return {}
            }
        }
    },
    data : function () {
        return {
            uid      : idCounter++,
            startConf: {
                onPick: function (selected) {
                    var parent = this.$parent
                    parent.endPicker.setMindate(this.parseDate(selected * 1 + parent.interval * oneDay))
                }
            },
            endConf: {}
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
    },
    ready: function () {
        this.startPicker = this.$children[0]
        this.endPicker   = this.$children[1]
    },

    methods: {
        getDate: function () {
            return {
                start: this.startPicker.getDate(),
                end  : new Date(this.endPicker.getDate() * 1 + oneDay - 1000)
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
