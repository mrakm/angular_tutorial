import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import * as am4core from '@amcharts/amcharts4/core';

export class Helpers {
  public static readonly SESSION_TIME_OUT = 'sessionTimeOut';

  static toDateOnly(date): string {
    if (typeof date === 'string' && date.split('T').length === 1) {
      date = `${date}T00:00:00`;
    }
    date = new Date(date);
    const year = date.getFullYear();

    const month = date.getMonth() + 1;
    const monthStr = month > 9 ? month : `0${month}`;

    const dayOfMonth = date.getDate();
    const dayStr = dayOfMonth > 9 ? dayOfMonth : `0${dayOfMonth}`;

    return `${year}-${monthStr}-${dayStr}`;
  }

  static toDateOnlyView(date): string {
    if (typeof date === 'string' && date.split('T').length === 1) {
      date = `${date}T00:00:00`;
    }
    date = new Date(date);
    const year = date.getFullYear();

    const month = date.getMonth() + 1;
    const monthStr = month > 9 ? month : `0${month}`;

    const dayOfMonth = date.getDate();
    const dayStr = dayOfMonth > 9 ? dayOfMonth : `0${dayOfMonth}`;

    return `${dayStr}-${monthStr}-${year}`;
  }

  static tConvert(time24): string {
    const tmpArr = time24.split(':');
    let time12;
    if (+tmpArr[0] === 12) {
      time12 = tmpArr[0] + ':' + tmpArr[1] + ' PM';
    } else {
      if (+tmpArr[0] === 0) {
        time12 = '12:' + tmpArr[1] + ' AM';
      } else {
        if (+tmpArr[0] > 12) {
          time12 = +tmpArr[0] - 12 + ':' + tmpArr[1] + ' PM';
        } else {
          time12 = +tmpArr[0] + ':' + tmpArr[1] + ' AM';
        }
      }
    }
    return time12;
  }
  static timeConverter(time): string {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? 'AM' : 'PM';
      time[0] = +time[0] % 12 || 12;
    }

    return `${time[0]}${time[1]}${time[2]}  ${time[5]}`;
  }

  static weekDaysDatePickerFilter(d: Date): boolean {
    const weekDay = new Date(d).getDay();

    if (weekDay === 0 || weekDay === 6) {
      return false;
    }

    return true;
  }

  static genericFiltration(ctrl, filterArray: any, filterOn: string | Array<string>, noSlice?: boolean): Observable<Array<any>> {
    if (typeof filterOn === 'string') {
      return ctrl.valueChanges.pipe(
        debounceTime(500),
        startWith(''),
        distinctUntilChanged(),
        map(value =>
          filterArray
            .filter(
              v =>
                (Helpers.resolveObj(filterOn, v) ? Helpers.resolveObj(filterOn, v).toLowerCase() : Helpers.resolveObj(filterOn, v)).indexOf(
                  typeof value === 'string' ? value.toLowerCase() : ''
                ) > -1
            )
            .slice(0, noSlice ? filterArray.length : 15)
        )
      );
    } else if (typeof filterOn === 'object') {
      return ctrl.valueChanges.pipe(
        debounceTime(500),
        startWith(''),
        distinctUntilChanged(),
        map(value =>
          filterArray
            .filter(v => Helpers.getConcatValue(filterOn, v).indexOf(typeof value === 'string' ? value.toLowerCase() : '') > -1)
            .slice(0, noSlice ? filterArray.length : 15)
        )
      );
    }
  }

  static getConcatValue(arr, value): string {
    let column = '';
    arr.forEach(element => {
      column += Helpers.resolveObj(element, value);
    });

    return column.toLowerCase();
  }

  static resolveObj(path, obj): any {
    return path.split('.').reduce((previous, current) => (previous ? previous[current] : null), obj || self);
  }

  static checkValidity(list: Array<any>, control: any, key: any): void {
    const condition = {};
    condition[key] = control.value;
    if (list.length === 0) {
      control.setErrors({ required: true });
    } else if (!_.find(list, condition)) {
      control.setErrors({ 'invalid-value': true });
    } else {
      control.clearValidators();
    }
  }

  static calculateAge(DOB, todayDate?): string {
    // DOB is a date
    let today;
    if (todayDate) today = new Date(todayDate);
    else today = new Date();
    const birthDate = new Date(DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    const d = today.getDate() - birthDate.getDate();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
      m += 11;
    }
    if (m === 0 && age === 0) {
      return `${today.getDate() - birthDate.getDate()} Day(s)`;
    }
    if (m === 1 && age === 0 && d < 0) {
      let totalDays = new Date(birthDate.getFullYear(), birthDate.getMonth() + 1, 0).getDate();
      return `${totalDays - birthDate.getDate() + today.getDate()} Day(s)`;
    }

    return `${age > 0 ? `${age} Year(s) ` : ''} ${m > 0 ? `${m} Month(s)` : ''} ${d > 0 ? `${d} Day(s)` : ''}`;
  }

  static calculateAgeYearOrMonthOrDays(DOB, todayDate?): string {
    // DOB is a date
    let today;
    if (todayDate) today = new Date(todayDate);
    else today = new Date();
    const birthDate = new Date(DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    const d = today.getDate() - birthDate.getDate();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
      m += 11;
    }
    if (m === 0 && age === 0) {
      return `${today.getDate() - birthDate.getDate()} Day(s)`;
    }

    if (age > 0) {
      return `${age} Year(s) `;
    } else if (m > 0) {
      return `${m} Month(s)`;
    } else {
      return `${d} Day(s)`;
    }

    return `${age > 0 ? `${age} Year(s) ` : ''} ${m > 0 ? `${m} Month(s)` : ''} ${d > 0 ? `${d} Day(s)` : ''}`;
  }

  static getDaysArray(start, end): Array<any> {
    for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }

    return arr;
  }

  static getHoursMinutesBetweenTwoDates(startDate, endDate) {
    var timeStart = new Date(startDate).getTime();
    var timeEnd = new Date(endDate).getTime();
    var hourDiff = timeEnd - timeStart; //in ms
    var secDiff = hourDiff / 1000; //in s
    var minDiff = hourDiff / 60 / 1000; //in minutes
    var hDiff = hourDiff / 3600 / 1000; //in hours
    var returnValue = { hours: 0, minutes: 0 };
    returnValue.hours = Math.floor(hDiff);
    returnValue.minutes = Math.floor(minDiff - 60 * returnValue.hours);
    return returnValue;
  }

  public static cleanObject(object: any) {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        if (object[key] === ('' || null)) {
          delete object[key];
        }
      }
    }
    return object;
  }

  public static setChartTitle(chart, option: { title: string; fontSize?: string; fontWeight?: string; align?: string }) {
    let topContainer = chart.chartContainer.createChild(am4core.Container);
    topContainer.layout = 'absolute';
    topContainer.toBack();
    topContainer.paddingBottom = 15;
    topContainer.width = am4core.percent(100);

    let axisTitle = topContainer.createChild(am4core.Label);
    axisTitle.text = option?.title ? option?.title : 'Title';
    axisTitle.fontSize = option?.fontSize ? option?.fontSize : '1.3rem';
    axisTitle.fontWeight = option?.fontWeight ? option?.fontWeight : '600';
    axisTitle.align = option?.align ? option?.align : 'left';
    axisTitle.paddingLeft = 0;
  }

  static hoursSeconds(hours) {
    hours = Number(hours);
    var s = Math.floor(hours * 3600);
    return s;
  }

  static secondsToHours(seconds) {
    seconds = Number(seconds);
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    return h.toString();
  }

  static secondsToHoursMins(seconds) {
    seconds = Number(seconds);
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    return h.toString() + ':' + m.toString();
  }
}
