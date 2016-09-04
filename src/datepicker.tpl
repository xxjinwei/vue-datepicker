<div class="datepicker-group" @click="markEventFromPicker" :class="{disabled:disabled}" id="{{uid}}">
    <input @click="isshow = true" v-model="value" :disabled="disabled" readonly="readonly">
    <i class="datepicker-icon" @click="disabled || (isshow = !isshow)"></i>
</div>
<template v-if="!disabled">
<div class="datepicker" v-show="isshow" v-click-outside="clickOutside" @click="markEventFromPicker" :style="style" v-transfer-dom>
    <div class="datepicker-header">
        <i class="datepicker-prev-year" @click="year <= minYear || year--" :class="{disabled: year <= minYear}"></i> <!-- prev year -->
        <i class="datepicker-prev-month" @click="(year <= minYear && month <= 0) || setMonth(month - 1)" :class="{disabled: year <= minYear && month <= 0}"></i> <!-- prev month -->
        <div class="datepicker-select datepicker-year"> <!-- year select -->
            <label>{{year + yearunit}}</label>
            <select v-model="year" number>
                <option v-for="(index, item) in years" value="{{item}}" selected="{{$value == year}}">{{item + yearunit}}</option>
            </select>
        </div>
        <div class="datepicker-select datepicker-month"> <!-- month select -->
            <label>{{months[month]}}</label>
            <select v-model="month" number>
                <option v-for="m in months" value="{{$index}}" selected="{{$value == month}}">{{m}}</option>
            </select>
        </div>
        <i class="datepicker-next-month" @click="(year >= maxYear && month >= 11) || setMonth(month + 1)" :class="{disabled: year >= maxYear && month >= 11}"></i> <!-- next month -->
        <i class="datepicker-next-year" @click="year >= maxYear || year++" :class="{disabled: year >= maxYear}"></i> <!-- next year -->
    </div>
    <table cellspacing="0" class="datepicker-calendar">
        <thead>
            <tr class="datepicker-dayofweek">
                <th v-for="w in week">{{w}}</th>
            </tr> <!-- week -->
        </thead>
        <tbody class="datepicker-days">
            <tr v-for="row in dates">
                <td v-for="cell in row"
                    :class="{istoday: cell.istoday, selected: cell.selected || (date === cell.value && month === selectedMonth && year === selectedYear), disabled: cell.disabled}"
                    @click="cell.value && !cell.disabled && selectDate(cell.value)">{{cell.text}}</td>
            </tr>
        </tbody> <!-- grid -->
        <tfoot>
            <tr>
                <td colspan="7"><span class="datepicker-today" @click="toToday">{{totodaytext}}</span></td>
            </tr>
        </tfoot>
    </table>
</div>
</template>
