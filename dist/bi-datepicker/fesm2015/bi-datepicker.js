import { EventEmitter, Component, Inject, PLATFORM_ID, NgZone, ChangeDetectorRef, Input, Output, Injectable, ɵɵdefineInjectable, ViewChildren, ComponentFactoryResolver, ViewChild, ViewContainerRef, NgModule } from '@angular/core';
import * as momentimp from 'moment';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WeekComponent {
    /**
     * @param {?} platform
     * @param {?} zone
     * @param {?} ref
     */
    constructor(platform, zone, ref) {
        this.platform = platform;
        this.zone = zone;
        this.ref = ref;
        this.weekendClass = "";
        this.dateSelected = new EventEmitter();
        this.keepInLocalStorage = (/**
         * @param {?} key
         * @param {?} val
         * @return {?}
         */
        (key, val) => {
            if (isPlatformBrowser(this.platform)) {
                if (typeof (localStorage) !== "undefined") {
                    localStorage.setItem(key, JSON.stringify(val));
                }
            }
        });
        this.getFromLocalStorage = (/**
         * @param {?} key
         * @return {?}
         */
        (key) => {
            try {
                if (isPlatformBrowser(this.platform)) {
                    if (typeof (localStorage) !== "undefined") {
                        return JSON.parse(localStorage.getItem(key ? key : ''));
                    }
                }
            }
            catch (ex) {
                return undefined;
            }
        });
    }
    // annotations:Annotation[];
    /**
     * @param {?} key
     * @return {?}
     */
    getFromSession(key) {
        if (isPlatformBrowser(this.platform)) {
            return JSON.parse(sessionStorage.getItem(key));
        }
    }
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    keepInSession(key, value) {
        if (isPlatformBrowser(this.platform)) {
            sessionStorage.setItem(key, value);
        }
    }
    /**
     * @param {?} amount
     * @return {?}
     */
    convertCurrency(amount) {
        /** @type {?} */
        let convertedAmount = amount;
        /** @type {?} */
        let convertFrom = this.currency;
        /** @type {?} */
        let convertTo = this.getFromLocalStorage("currency");
        if (convertFrom && convertTo && convertFrom.trim() != convertTo.trim()) {
            /** @type {?} */
            let exchangeRates = this.getFromSession("currencyexchangerates");
            if (exchangeRates) {
                /** @type {?} */
                let exchange = exchangeRates.filter((/**
                 * @param {?} x
                 * @return {?}
                 */
                x => x.BaseCurrency == convertFrom.trim() && x.ConvertedCurrency == convertTo.trim()));
                if (exchange != undefined && exchange.length) {
                    convertedAmount = Math.round(amount * exchange[0].ExchangeRate);
                }
                else {
                    this.keepInLocalStorage("currencysymbol", this.currencySymbol);
                    this.keepInLocalStorage("currency", this.currency);
                }
            }
        }
        return convertedAmount;
    }
    /**
     * @param {?} hld
     * @return {?}
     */
    addHolidays(hld) {
        this.week.forEach((/**
         * @param {?} w
         * @return {?}
         */
        (w) => {
            /** @type {?} */
            let h = hld.filter((/**
             * @param {?} d
             * @return {?}
             */
            (d) => {
                return parseInt(d.day) === parseInt(w.day);
            }));
            if (w.isCurrentMonth) {
                if (h.length > 0) {
                    w.isHoliday = true;
                    w.toolTip = h[0].name;
                }
            }
        }));
        this.ref.detectChanges();
    }
    /**
     * @param {?} ann
     * @return {?}
     */
    addAnnotation(ann) {
        this.week.forEach((/**
         * @param {?} w
         * @return {?}
         */
        (w) => {
            /** @type {?} */
            let h = ann.filter((/**
             * @param {?} d
             * @return {?}
             */
            (d) => {
                return d.day === w.day;
            }));
            if (w.isCurrentMonth) {
                if (h.length > 0) {
                    w.annotation = h[0].text;
                    if (w.annotation != '' && this.currency && this.currencySymbol) {
                        /** @type {?} */
                        let changedCurrency = this.getFromLocalStorage('currencysymbol');
                        /** @type {?} */
                        let amount = w.annotation.split(changedCurrency)[1];
                        w.annotation = changedCurrency + this.convertCurrency(parseInt(amount));
                    }
                    w.highlight = h[0].highlight;
                }
            }
        }));
        if (this.ref && !((/** @type {?} */ (this.ref))).destroy) {
            this.ref.detectChanges();
        }
    }
    /**
     * @param {?} e
     * @param {?} d
     * @return {?}
     */
    selectDate(e, d) {
        this.zone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            e.stopPropagation();
            if (d.isActive && d.isCurrentMonth && d.annotation && d.annotation != '') {
                this.dateSelected.emit(('00' + d.day).slice(-2) + '-' + ('00' + d.month).slice(-2) + '-' + d.year);
                // d.isSelected = !d.isSelected;
                this.ref.detectChanges();
            }
        }));
    }
    /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    trackByFn(index, item) {
        return item.id;
    }
}
WeekComponent.decorators = [
    { type: Component, args: [{
                selector: 'bi-week',
                template: "<div fxFlex fxLayout=\"row\" fxLayoutGap=\"2px\" fxLayoutAlign=\"space-evenly\" class=\"week-wrap bg_color_grey\">\r\n  <ng-container *ngFor=\"let d of week; trackBy: trackByFn\">\r\n    <div (click)=\"selectDate($event,d)\" [matTooltip]=\"d.toolTip\"\r\n      [ngClass]=\"{'mobile': vertical , 'weekend': d.isWeekend, 'disabled-date': d.isCurrentMonth===false && !d.isActive,'inactive-date': !d.isActive && d.isCurrentMonth,'long-weekend':d.isLongWeekend, 'selected-date':d.isSelected, 'inbetweenSelected-date':d.isInBetween && d.isCurrentMonth,'border-grey':(d.annotation && d.annotation != ''), 'border-danger': +d.annotation==0, 'border-warning':(d.annotation && d.annotation != '') && (+d.annotation<=10 && +d.annotation>0 )  }\"\r\n      fxLayout=\"column\" fxLayoutAlign=\"center center\">\r\n      <section>{{d.day}}</section>\r\n      <section *ngIf=\"d.annotation && d.annotation != ''\" class=\"setsCount\"><i class=\"seatIcon\"></i>{{d.annotation}}\r\n      </section>\r\n      <!-- <span [ngClass]=\"{'lowestfare':d.highlight}\"\r\n                                *ngIf=\"d.annotation && d.annotation != ''\">{{d.annotation}}</span> <span\r\n                                *ngIf=\"d.isHoliday\" class=\"holiday\"></span> -->\r\n    </div>\r\n\r\n  </ng-container>\r\n</div>\r\n\r\n<!--{{(\"00\"+d.day).slice(-2)}} -->\r\n"
                //template:`<h1>ds</h1>`
                ,
                styles: [".week-wrap div{padding:0;background:rgba(255,255,255,.5);text-align:center;vertical-align:middle;height:57px;width:57px;font-size:14px;font-weight:500;position:relative;margin:5px 0;border-radius:5px}@media only screen and (max-width:768px){.week-wrap div{width:40px!important}}.seatIcon{background:url(/assets/images/seat-left-grey.png) center center no-repeat;display:inline-block;background-size:contain!important;height:14px;margin-right:3px;width:14px}.setsCount{font-size:11px;color:#6c6c6c}.bg_color_grey{background-color:#f5f5f5}.week-wrap div span{display:block;font-size:10px;color:#a8a8a8;font-weight:400}.week-wrap div span.lowestfare{color:#198a0d}.week-wrap div span.holiday{position:absolute;right:3px;top:4px;width:5px;height:5px;background:#d32f2f;z-index:1;display:inline-block}.week-wrap div.mobile span.holiday{border-radius:50%}.week-wrap div.inbetweenSelected-date{color:#3966b9;background:rgba(150,186,240,.18)}.week-wrap div.long-weekend{background:#e8e8e8}.week-wrap div.long-weekend::before{content:'';position:absolute;left:0;top:0;width:100%;height:2px;background:#d32f2f}.week-wrap div.weekend{color:#d32f2f}.week-wrap div.disabled-date{color:#fff}.week-wrap div.inactive-date{color:#bbb}.week-wrap div.selected-date span{color:#fff}.week-wrap div:not(.inactive-date):hover{color:#000;background:rgba(25,71,138,.18);cursor:pointer}.week-wrap div.selected-date,.week-wrap div.selected-date:hover{color:#fff;background:#367275}.disabled-date:hover{color:transparent!important;background:0 0!important;cursor:default!important}.week-wrap div.mobile{border-radius:4px;touch-action:pan-y!important}.border-danger{border-bottom:2px solid #e7453d!important}.border-warning{border-bottom-color:#f5a623}.border-grey{border-bottom:2px solid #c5bfbfde}div.selected-date>.setsCount{color:#fff}"]
            }] }
];
/** @nocollapse */
WeekComponent.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: NgZone },
    { type: ChangeDetectorRef }
];
WeekComponent.propDecorators = {
    week: [{ type: Input }],
    weekendClass: [{ type: Input }],
    vertical: [{ type: Input }],
    currency: [{ type: Input }],
    currencySymbol: [{ type: Input }],
    dateSelected: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    WeekComponent.prototype.week;
    /** @type {?} */
    WeekComponent.prototype.weekendClass;
    /** @type {?} */
    WeekComponent.prototype.vertical;
    /** @type {?} */
    WeekComponent.prototype.currency;
    /** @type {?} */
    WeekComponent.prototype.currencySymbol;
    /** @type {?} */
    WeekComponent.prototype.dateSelected;
    /** @type {?} */
    WeekComponent.prototype.keepInLocalStorage;
    /** @type {?} */
    WeekComponent.prototype.getFromLocalStorage;
    /**
     * @type {?}
     * @private
     */
    WeekComponent.prototype.platform;
    /**
     * @type {?}
     * @private
     */
    WeekComponent.prototype.zone;
    /**
     * @type {?}
     * @private
     */
    WeekComponent.prototype.ref;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class BiDatepickerService {
    constructor() {
        this.months = new Map();
    }
    /**
     * @param {?} month
     * @return {?}
     */
    getMonth(month) {
        if (this.months.has(month)) {
            return this.months[month];
        }
        else {
            return null;
        }
    }
    /**
     * @param {?} key
     * @param {?} month
     * @return {?}
     */
    addMonth(key, month) {
        if (this.months.has(key)) {
            this.months.delete(key);
        }
        this.months.set(key, month);
    }
}
BiDatepickerService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
BiDatepickerService.ctorParameters = () => [];
/** @nocollapse */ BiDatepickerService.ngInjectableDef = ɵɵdefineInjectable({ factory: function BiDatepickerService_Factory() { return new BiDatepickerService(); }, token: BiDatepickerService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    BiDatepickerService.prototype.months;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const moment = momentimp;
class MonthComponent {
    /**
     * @param {?} zone
     * @param {?} ref
     * @param {?} service
     */
    constructor(zone, ref, service) {
        this.zone = zone;
        this.ref = ref;
        this.service = service;
        this.showSelected = true;
        this.weekendClass = "";
        this.inActiveClass = "";
        this.dateSelected = new EventEmitter();
        this.weeks = [];
        this.monthName = "";
        this.weekWithId = [];
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this.generateWeeks();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.generateWeeks();
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
    }
    /**
     * @param {?} hld
     * @return {?}
     */
    addHolidays(hld) {
        this.holidays = hld;
        /** @type {?} */
        let hlds = [];
        if (this.holidays && this.holidays.holidays) {
            if (this.holidays.holidays.length > 0) {
                this.cmpWeeks.forEach((/**
                 * @param {?} d
                 * @return {?}
                 */
                (d) => {
                    /** @type {?} */
                    let h = this.holidays.holidays.filter((/**
                     * @param {?} x
                     * @return {?}
                     */
                    (x) => d.week.filter((/**
                     * @param {?} w
                     * @return {?}
                     */
                    (w) => parseInt(w.day) === parseInt(x.day))).length > 0));
                    if (h.length > 0) {
                        d.addHolidays(h);
                        //hlds.push(h[0]);
                    }
                }));
            }
        }
        this.ref.detectChanges();
        //return hlds;
    }
    /**
     * @param {?} ann
     * @return {?}
     */
    addAnnotations(ann) {
        this.annotation = ann;
        /** @type {?} */
        let anns = [];
        if (this.annotation && this.annotation.annotations) {
            if (this.annotation.annotations.length > 0) {
                this.cmpWeeks.forEach((/**
                 * @param {?} d
                 * @return {?}
                 */
                (d) => {
                    /** @type {?} */
                    let h = this.annotation.annotations.filter((/**
                     * @param {?} x
                     * @return {?}
                     */
                    (x) => d.week.filter((/**
                     * @param {?} w
                     * @return {?}
                     */
                    (w) => w.day === x.day)).length > 0));
                    if (h.length > 0) {
                        d.addAnnotation(h);
                        //hlds.push(h[0]);
                    }
                    //d['runtime'] = 'thenga';
                }));
            }
            //console.log(this.cmpWeeks)
        }
        //return hlds;
    }
    /**
     * @private
     * @return {?}
     */
    generateWeeks() {
        // console.log('generating weeks', this.month);
        /** @type {?} */
        let cal = moment().year(this.year).month(this.month - 1).startOf('month');
        /** @type {?} */
        let startDay = parseInt(cal.format('d'), 10);
        /** @type {?} */
        let endDay = cal.daysInMonth();
        this.monthName = cal.format('MMMM');
        /** @type {?} */
        var prevEndDay = cal.subtract(1, "month").daysInMonth();
        /** @type {?} */
        let weekdays = [];
        /** @type {?} */
        let monthCache = this.service.getMonth(cal.format("YYYYMM"));
        if (monthCache == null) {
            weekdays.push([]);
            /** @type {?} */
            let dateIn = this.Date.split('-');
            /** @type {?} */
            let dmIn = parseInt(dateIn[1]);
            /** @type {?} */
            let dyIn = parseInt(dateIn[2]);
            /** @type {?} */
            let ddIn = parseInt(dateIn[0]);
            /** @type {?} */
            let c1 = 1;
            // Previous Month filling in current month
            for (let i = prevEndDay - startDay + 1, j = startDay; j > 0; i++, j--) {
                weekdays[0].push((/** @type {?} */ ({
                    id: this.year.toString() + this.month.toString() + i.toString(),
                    day: i.toString(),
                    month: this.month.toString(),
                    year: this.year.toString(),
                    isCurrentMonth: false,
                    isActive: false,
                    isSelected: this.showSelected && ((this.month == dmIn && this.year == dyIn && ddIn == (c1 - 1))),
                    isWeekend: weekdays[0].length == 0 ? true : false,
                    //|| this.weeks[0].length==6
                    isHoliday: false,
                    toolTip: '',
                })));
                // console.log(weekdays, "weekdays");
            }
            /** @type {?} */
            let c = 1;
            /** @type {?} */
            let cdate = moment().startOf('day');
            //current month after previous month;
            for (let i = startDay; i < 7; i++) {
                cal = cal.year(this.year).month(this.month - 1).date(c).startOf('day');
                /** @type {?} */
                let act = true;
                /** @type {?} */
                let act1 = true;
                if (typeof (this.minDate) != "undefined") {
                    act = cal.diff(cdate, 'days') >= this.minDate;
                }
                if (typeof (this.maxDate) != "undefined") {
                    act1 = cal.diff(cdate, 'days') <= this.maxDate;
                }
                weekdays[0].push((/** @type {?} */ ({
                    id: this.year.toString() + this.month.toString() + c.toString(),
                    day: (c++).toString(),
                    isCurrentMonth: true,
                    isActive: act && act1,
                    month: this.month.toString(),
                    year: this.year.toString(),
                    isWeekend: weekdays[0].length == 0 ? true : false,
                    //|| this.weeks[0].length==6
                    isSelected: this.showSelected && ((this.month == dmIn && this.year == dyIn && ddIn == (c - 1))),
                })));
            }
            /** @type {?} */
            let cm = true;
            for (let i = 1; i < 6; i++) {
                weekdays.push([]);
                for (let j = 0; j < 7; j++) {
                    cal = cal.year(this.year).month(this.month - 1).date(c).startOf('day');
                    /** @type {?} */
                    let act = true;
                    /** @type {?} */
                    let act1 = true;
                    if (typeof (this.minDate) != "undefined") {
                        act = cal.diff(cdate, 'days') >= this.minDate;
                    }
                    if (typeof (this.maxDate) != "undefined") {
                        act1 = cal.diff(cdate, 'days') <= this.maxDate;
                    }
                    weekdays[weekdays.length - 1].push((/** @type {?} */ ({
                        id: this.year.toString() + this.month.toString() + c.toString(),
                        day: (c++).toString(),
                        isCurrentMonth: cm,
                        isActive: act && act1 && cm,
                        month: this.month.toString(),
                        year: this.year.toString(),
                        isWeekend: weekdays[weekdays.length - 1].length == 0 ? true : false,
                        //|| this.weeks[this.weeks.length - 1].length==6 for saturday
                        isSelected: this.showSelected && ((this.month == dmIn && this.year == dyIn && ddIn == (c - 1) && cm === true)),
                    })));
                    if (c > endDay) {
                        c = 1;
                        cm = false;
                    }
                }
                if (!cm) {
                    break;
                }
            }
            this.service.addMonth(cal.format("YYYYMM"), weekdays);
        }
        else {
            weekdays = monthCache;
        }
        // this.weeks = weekdays;
        // this.ref.detectChanges();
        this.weekWithId = weekdays.map((/**
         * @param {?} w
         * @param {?} index
         * @return {?}
         */
        (w, index) => {
            return {
                id: this.year.toString() + this.month.toString() + index.toString(),
                weekdays: w
            };
        }));
    }
    /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    trackByFn(index, item) {
        return item.id;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    onDateSelected(date) {
        this.dateSelected.emit(date);
    }
}
MonthComponent.decorators = [
    { type: Component, args: [{
                selector: 'bi-month',
                template: "<div>\r\n    <div class=\"month-head\" [ngClass]=\"{'mobile':vertical}\">{{monthName}} <span>{{year}}</span> </div>\r\n    <div fxFlexLayout=\"row\" fxLayoutAlign=\"space-evenly center\" class=\"day-name\" [ngClass]=\"{'mobile':vertical}\">\r\n        <div>Sun</div>\r\n        <div>Mon</div>\r\n        <div>Tue</div>\r\n        <div>Wed</div>\r\n        <div>Thu</div>\r\n        <div>Fri</div>\r\n        <div>Sat</div>\r\n\r\n    </div>\r\n    <bi-week *ngFor=\"let w of weekWithId;let i=index; trackBy: trackByFn\" [week]=\"w.weekdays\"\r\n        (dateSelected)=\"onDateSelected($event)\" [vertical]=\"vertical\" [currency]='currency'\r\n        [currencySymbol]='currencySymbol'></bi-week>\r\n    <div class=\"strips\" *ngIf=\"vertical== true && holidays\">\r\n        <div class=\"scrolldiv\">\r\n            <ul *ngIf=\"holidays\">\r\n                <li *ngFor=\"let hld of holidays.holidays;\">\r\n                    <h5><span>{{hld.day}}</span> -{{hld.name}}</h5>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</div>",
                styles: [".month-head{text-align:center;font-size:14px;font-weight:700;color:#d32f2f;text-transform:uppercase;padding:15px 0}.month-head.mobile{color:#000;font-weight:400;text-transform:capitalize;font-size:17px}.month-head.mobile span{font-weight:700}.day-name.mobile{background:#fff;box-shadow:0 5px 8px -3px rgba(0,0,0,.1);margin:0 -15px 15px;padding:0 15px}.day-name{background-color:#f5f5f5}.day-name div{height:38px;width:41px;padding:0;margin:0;text-align:center;font-weight:700;line-height:41px;color:#000;font-size:13px;text-transform:capitalize}.strips{background:#fee;padding:0 15px;margin:13px -15px 0}.strips ul{text-align:left;white-space:nowrap}.strips ul li{padding:0 0 0 10px;position:relative;list-style-type:none;display:inline-block;margin-right:15px}.strips ul li:last-child{margin:0}.strips ul li h5{font-size:13px;color:#5a5a58;font-weight:400}.strips ul li h5 span{font-weight:500;color:#000}.strips ul li::before{content:'';left:0;top:6px;width:5px;height:5px;border-radius:50%;background:#d32f2e;position:absolute;z-index:1}.scrolldiv{overflow:hidden;overflow-x:auto;width:100%;padding:12px 0}"]
            }] }
];
/** @nocollapse */
MonthComponent.ctorParameters = () => [
    { type: NgZone },
    { type: ChangeDetectorRef },
    { type: BiDatepickerService }
];
MonthComponent.propDecorators = {
    cmpWeeks: [{ type: ViewChildren, args: [WeekComponent,] }],
    showSelected: [{ type: Input }],
    Date: [{ type: Input }],
    month: [{ type: Input }],
    year: [{ type: Input }],
    weekendClass: [{ type: Input }],
    inActiveClass: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    vertical: [{ type: Input }],
    currency: [{ type: Input }],
    currencySymbol: [{ type: Input }],
    dateSelected: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    MonthComponent.prototype.cmpWeeks;
    /** @type {?} */
    MonthComponent.prototype.showSelected;
    /** @type {?} */
    MonthComponent.prototype.Date;
    /** @type {?} */
    MonthComponent.prototype.month;
    /** @type {?} */
    MonthComponent.prototype.year;
    /** @type {?} */
    MonthComponent.prototype.weekendClass;
    /** @type {?} */
    MonthComponent.prototype.inActiveClass;
    /** @type {?} */
    MonthComponent.prototype.minDate;
    /** @type {?} */
    MonthComponent.prototype.maxDate;
    /** @type {?} */
    MonthComponent.prototype.vertical;
    /** @type {?} */
    MonthComponent.prototype.currency;
    /** @type {?} */
    MonthComponent.prototype.currencySymbol;
    /** @type {?} */
    MonthComponent.prototype.dateSelected;
    /** @type {?} */
    MonthComponent.prototype.weeks;
    /** @type {?} */
    MonthComponent.prototype.monthName;
    /** @type {?} */
    MonthComponent.prototype.weekWithId;
    /** @type {?} */
    MonthComponent.prototype.annotation;
    /** @type {?} */
    MonthComponent.prototype.holidays;
    /**
     * @type {?}
     * @private
     */
    MonthComponent.prototype.zone;
    /**
     * @type {?}
     * @private
     */
    MonthComponent.prototype.ref;
    /**
     * @type {?}
     * @private
     */
    MonthComponent.prototype.service;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const moment$1 = momentimp;
class CalendarComponent {
    /**
     * @param {?} r
     * @param {?} zone
     * @param {?} platform
     * @param {?} cRef
     */
    constructor(r, zone, platform, cRef) {
        this.r = r;
        this.zone = zone;
        this.platform = platform;
        this.cRef = cRef;
        this.months = 1;
        this.weekendClass = "";
        this.vertical = false;
        this.monthChanged = new EventEmitter();
        this.month = [];
        this.dateSelected = new EventEmitter();
        this.difference = 0;
        this.showSelected = true;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platform)) {
            if (this.vertical == true) {
                this.monthParent.nativeElement.scroll(0, this.slider.element.nativeElement.nextElementSibling.clientHeight * this.difference, { behavior: 'smooth' });
            }
            // console.log(this.difference, "this.difference");
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.annotations = [];
        this.holidays = [];
        this.initMonths();
        if (this.vertical == true) {
            if (this.Date != undefined && this.Date.length > 0 && this.date != null) {
                this.showSelected = true;
                this.date = this.Date;
                this.difference = moment$1([parseInt(this.Date.split('-')[2]), parseInt(this.Date.split('-')[1]) - 1]).diff(moment$1([new Date().getFullYear(), new Date().getMonth()]), 'months', true);
            }
            else {
                this.showSelected = false;
                this.date = moment$1().format('DD-MM-YYYY');
                this.difference = moment$1([parseInt(this.date.split('-')[2]), parseInt(this.date.split('-')[1]) - 1]).diff(moment$1([new Date().getFullYear(), new Date().getMonth()]), 'months', true);
            }
            this.difference = Math.floor(this.difference);
            if (this.difference > 0) {
                for (let i = 0; i < this.difference; i++)
                    this.prevMonth(true);
            }
        }
        //this.month = Array[this.months].fill((x,i)=>cMonth++);
        // window.addEventListener('scroll', this.scrollEvent.bind(this), true);
        if (isPlatformBrowser(this.platform)) {
            this.zone.runOutsideAngular((/**
             * @return {?}
             */
            () => {
                this.scrollSubscription = fromEvent(window, 'scroll', { passive: true, capture: true }).pipe(debounceTime(500)).subscribe((/**
                 * @param {?} e
                 * @return {?}
                 */
                e => {
                    this.scrollEvent(e);
                }));
            }));
        }
    }
    /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    trackByFn(index, item) {
        return item.id;
    }
    /**
     * @private
     * @return {?}
     */
    initMonths() {
        this.month = [];
        this.date = this.Date;
        if (typeof (this.Date) == "undefined" || this.Date.length == 0) {
            this.date = moment$1().format('DD-MM-YYYY');
            this.showSelected = false;
        }
        else {
            this.showSelected = true;
        }
        /** @type {?} */
        let m = this.date.split('-')[1];
        /** @type {?} */
        let y = this.date.split('-')[2];
        /** @type {?} */
        let cYear = parseInt(y);
        /** @type {?} */
        let cMonth = moment$1().set('year', cYear).set('month', parseInt(m) - 1).month() + 1;
        for (let i = 0; i < this.months; i++) {
            this.month.push((/** @type {?} */ ({
                id: cYear + '' + cMonth,
                year: cYear,
                month: cMonth
            })));
            this.monthChanged.emit((/** @type {?} */ ({
                year: cYear,
                month: cMonth,
                component: this
            })));
            cMonth++;
            if (cMonth > 12) {
                cMonth = 1;
                cYear++;
            }
        }
    }
    /**
     * @param {?=} status
     * @return {?}
     */
    prevMonth(status) {
        /** @type {?} */
        let firstMonth = this.month[0];
        /** @type {?} */
        let newMonth = (/** @type {?} */ ({ component: this }));
        if (firstMonth.month === new Date().getUTCMonth() + 1 && firstMonth.year === new Date().getUTCFullYear()) { }
        else {
            if (firstMonth.month === 1) {
                newMonth.month = 12;
                newMonth.year = firstMonth.year - 1;
            }
            else {
                newMonth.month = firstMonth.month - 1;
                newMonth.year = firstMonth.year;
            }
            newMonth.id = newMonth.year.toString() + newMonth.month.toString();
            if (status == true) {
                this.month.unshift(newMonth);
            }
            else {
                this.month.pop();
                this.month.unshift(newMonth);
                this.cRef.detectChanges();
                this.monthChanged.emit(newMonth);
            }
        }
    }
    /**
     * @return {?}
     */
    nextMonth() {
        /** @type {?} */
        let lastMonth = this.month[this.month.length - 1];
        /** @type {?} */
        let newMonth = (/** @type {?} */ ({ component: this }));
        /** @type {?} */
        let month = 12 - new Date().getUTCMonth() + 1;
        if ((month === 11 && lastMonth.month === 12 && this.month && this.month.length > 12) || (lastMonth.month >= new Date().getUTCMonth() + 1 && lastMonth.year == new Date().getUTCFullYear() + 1)) { }
        else {
            if (lastMonth.month > 11) {
                newMonth.month = 1;
                newMonth.year = lastMonth.year + 1;
            }
            else {
                newMonth.month = lastMonth.month + 1;
                newMonth.year = lastMonth.year;
            }
            if (!this.vertical) {
                this.month.shift();
            }
            newMonth['id'] = newMonth.year + '' + newMonth.month;
            this.month.push(newMonth);
            this.cRef.detectChanges();
            this.monthChanged.emit(newMonth);
        }
    }
    /**
     * @param {?} annotation
     * @return {?}
     */
    addAnnotations(annotation) {
        this.removeAnnotations(annotation.month, annotation.year);
        this.annotations = [
            ...this.annotations,
            annotation
        ];
        this.cmpMonths.map((/**
         * @param {?} m
         * @return {?}
         */
        (m) => {
            /** @type {?} */
            let hlds = this.annotations.filter((/**
             * @param {?} x
             * @return {?}
             */
            x => x.month == m.month && x.year == m.year));
            if (hlds.length > 0) {
                m.addAnnotations(hlds[0]);
            }
            //     m.holidays = hlds.length > 0 ? hlds[0] : {month:m.month,year:m.year} as Holidays;
        }));
        // this.month.map((m)=>{
        //     let ann = this.annotations.filter(x=>x.month==m.month && x.year == m.year);
        //     m.annotation = ann.length > 0 ? ann[0] : {month:m.month,year:m.year} as Annotations;
        // });
    }
    /**
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    removeAnnotations(month, year) {
        if (this.annotations) {
            this.annotations = this.annotations.filter((/**
             * @param {?} x
             * @return {?}
             */
            (x) => !(x.year == year && x.month == month)));
        }
        else {
            this.annotations = [];
        }
    }
    /**
     * @param {?} holidays
     * @return {?}
     */
    addHolidays(holidays) {
        this.removeHolidays(holidays.month, holidays.year);
        this.holidays = [
            ...this.holidays,
            holidays
        ];
        this.cmpMonths.map((/**
         * @param {?} m
         * @return {?}
         */
        (m) => {
            /** @type {?} */
            let hlds = this.holidays.filter((/**
             * @param {?} x
             * @return {?}
             */
            x => x.month == m.month && x.year == m.year));
            if (hlds.length > 0) {
                m.addHolidays(hlds[0]);
            }
            //     m.holidays = hlds.length > 0 ? hlds[0] : {month:m.month,year:m.year} as Holidays;
        }));
        // this.month.map((m)=>{
        //     let hlds = this.holidays.filter(x=>x.month==m.month && x.year == m.year);
        //     m.holidays = hlds.length > 0 ? hlds[0] : {month:m.month,year:m.year} as Holidays;
        // });
        // this.cd.detectChanges();
    }
    /**
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    removeHolidays(month, year) {
        if (this.holidays) {
            this.holidays = this.holidays.filter((/**
             * @param {?} x
             * @return {?}
             */
            (x) => !(x.year == year && x.month == month)));
        }
        else {
            this.holidays = [];
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    onDateSelected(date) {
        this.dateSelected.emit(date);
        this.date = date;
        this.showSelected = true;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    onDateChanged(date) {
        this.date = date;
        this.showSelected = true;
    }
    /**
     * @param {?} eve
     * @return {?}
     */
    scrollEvent(eve) {
        if (eve.target.className == "monthouter") {
            //if ((eve.target.scrollTop + eve.target.offsetHeight) >= eve.target.scrollHeight) {
            if ((eve.target.scrollTop + (eve.target.offsetHeight * (3))) >= eve.target.scrollHeight) {
                // you're at the bottom of the page
                this.nextMonth();
                this.cRef.detectChanges();
            }
            else if (eve.target.scrollTop == 0) {
                // this.prevMonth(); // COMMENTED TO AVOID SCROLLING OF SELECTED DATES TO BOTTOM OF SCREEN
                this.cRef.detectChanges();
            }
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.scrollSubscription) {
            this.scrollSubscription.unsubscribe();
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const change = changes.Date || null;
        if (change && change.previousValue) { // if there is a previous change
            if (change.currentValue !== change.previousValue) {
                // this.initMonths();
                this.date = change.currentValue;
                if (change.currentValue != undefined && change.currentValue != null && change.currentValue != "") {
                    this.showSelected = true;
                }
                else {
                    this.showSelected = false;
                }
            }
        }
    }
}
CalendarComponent.decorators = [
    { type: Component, args: [{
                selector: 'bi-calendar',
                template: "<div class=\"outer\" [ngClass]=\"{'mobile':vertical}\">\r\n    <div *ngIf=\"vertical==false\" class=\"month-nav left\" (click)=\"prevMonth()\">\r\n        <mat-icon class=\"icon\">arrow_back</mat-icon>\r\n    </div>\r\n    <div fxLayoutAlign=\"space-between start\" [fxLayout]=\"vertical ? 'column' : 'row'\" class=\"monthouter\" #year>\r\n        <ng-container *ngFor=\"let m of month; trackBy: trackByFn\" #months>\r\n            <bi-month [vertical]=\"vertical\" class=\"month\" [minDate]=\"minDate\"\r\n\r\n             [maxDate]=\"maxDate\"\r\n             [showSelected]=\"showSelected\"\r\n                (dateSelected)=\"onDateSelected($event)\" [year]=\"m.year\" [month]=\"m.month\" fxFlex fxLayoutGap=\"20px\"\r\n                [Date]=\"date\" [currency]='currency'\r\n                [currencySymbol]='currencySymbol'></bi-month>\r\n        </ng-container>\r\n    </div>\r\n    <div *ngIf=\"vertical==false\" class=\"month-nav right\" (click)=\"nextMonth()\">\r\n        <mat-icon class=\"icon\">arrow_forward</mat-icon>\r\n    </div>\r\n</div>\r\n",
                styles: [".outer{position:relative}.month-nav{font-weight:700;cursor:pointer;position:absolute;top:21px;z-index:10}.left{left:15px}.right{right:15px}.mat-icon.icon{color:grey}.month{width:50%;padding:10px 15px}.monthouter,.outer.mobile .month{width:100%}.outer.mobile .monthouter{width:100%;height:calc(100vh - 114px);overflow:hidden;overflow-y:auto;padding-bottom:100px}.outer.mobile .monthouter .month:first-child{border-right:0}"]
            }] }
];
/** @nocollapse */
CalendarComponent.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: ChangeDetectorRef }
];
CalendarComponent.propDecorators = {
    cmpMonths: [{ type: ViewChildren, args: [MonthComponent,] }],
    slider: [{ type: ViewChild, args: ['months', { read: ViewContainerRef, static: false },] }],
    monthParent: [{ type: ViewChild, args: ['year', { static: false },] }],
    months: [{ type: Input }],
    Date: [{ type: Input }],
    weekendClass: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    vertical: [{ type: Input }],
    currency: [{ type: Input }],
    currencySymbol: [{ type: Input }],
    monthChanged: [{ type: Output }],
    dateSelected: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    CalendarComponent.prototype.cmpMonths;
    /**
     * @type {?}
     * @private
     */
    CalendarComponent.prototype.slider;
    /**
     * @type {?}
     * @private
     */
    CalendarComponent.prototype.monthParent;
    /** @type {?} */
    CalendarComponent.prototype.months;
    /** @type {?} */
    CalendarComponent.prototype.Date;
    /** @type {?} */
    CalendarComponent.prototype.weekendClass;
    /** @type {?} */
    CalendarComponent.prototype.minDate;
    /** @type {?} */
    CalendarComponent.prototype.maxDate;
    /** @type {?} */
    CalendarComponent.prototype.vertical;
    /** @type {?} */
    CalendarComponent.prototype.currency;
    /** @type {?} */
    CalendarComponent.prototype.currencySymbol;
    /** @type {?} */
    CalendarComponent.prototype.monthChanged;
    /** @type {?} */
    CalendarComponent.prototype.month;
    /**
     * @type {?}
     * @private
     */
    CalendarComponent.prototype.annotations;
    /**
     * @type {?}
     * @private
     */
    CalendarComponent.prototype.holidays;
    /** @type {?} */
    CalendarComponent.prototype.dateSelected;
    /** @type {?} */
    CalendarComponent.prototype.date;
    /** @type {?} */
    CalendarComponent.prototype.difference;
    /** @type {?} */
    CalendarComponent.prototype.scrollSubscription;
    /** @type {?} */
    CalendarComponent.prototype.showSelected;
    /**
     * @type {?}
     * @private
     */
    CalendarComponent.prototype.r;
    /**
     * @type {?}
     * @private
     */
    CalendarComponent.prototype.zone;
    /**
     * @type {?}
     * @private
     */
    CalendarComponent.prototype.platform;
    /** @type {?} */
    CalendarComponent.prototype.cRef;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class BiDatepickerComponent {
    constructor() {
        this.isOpen = false;
        this.weekendClass = "";
        this.monthChanged = new EventEmitter();
        this.open = new EventEmitter();
        this.dateSelected = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    toggleCalendar() {
        this.isOpen = !this.isOpen;
        this.open.emit(this.isOpen);
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
    }
    /**
     * @param {?} my
     * @return {?}
     */
    onMonthChanged(my) {
        this.monthChanged.emit({ month: my.month, year: my.year });
    }
    /**
     * @param {?} annotation
     * @return {?}
     */
    addAnnotations(annotation) {
        this.calendar.addAnnotations(annotation);
    }
    /**
     * @param {?} holidays
     * @return {?}
     */
    addHolidays(holidays) {
        this.calendar.addHolidays(holidays);
    }
    /**
     * @param {?} date
     * @return {?}
     */
    onDateSelected(date) {
        this.dateSelected.emit(date);
    }
}
BiDatepickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'bi-datepicker',
                template: "<div fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\r\n    <input matInput id=\"dtPicker\" fxFlex (focus)=\"toggleCalendar()\"/> <span><mat-icon (click)=\"toggleCalendar()\" >date_range</mat-icon></span>    \r\n</div>\r\n\r\n<ng-container *ngIf=\"isOpen\" >\r\n    <bi-calendar [vertical]=\"vertical\" [Date]=\"Date\"  [months]=\"months\" [minDate]=\"minDate\" [maxDate]=\"maxDate\" (monthChanged)=\"onMonthChanged($event)\" (dateSelected)=\"onDateSelected($event)\" ></bi-calendar>\r\n</ng-container>"
            }] }
];
/** @nocollapse */
BiDatepickerComponent.ctorParameters = () => [];
BiDatepickerComponent.propDecorators = {
    calendar: [{ type: ViewChild, args: [CalendarComponent, { static: false },] }],
    months: [{ type: Input }],
    Date: [{ type: Input }],
    weekendClass: [{ type: Input }],
    vertical: [{ type: Input }],
    monthChanged: [{ type: Output }],
    open: [{ type: Output }],
    dateSelected: [{ type: Output }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    BiDatepickerComponent.prototype.calendar;
    /** @type {?} */
    BiDatepickerComponent.prototype.months;
    /** @type {?} */
    BiDatepickerComponent.prototype.Date;
    /** @type {?} */
    BiDatepickerComponent.prototype.isOpen;
    /** @type {?} */
    BiDatepickerComponent.prototype.weekendClass;
    /** @type {?} */
    BiDatepickerComponent.prototype.vertical;
    /** @type {?} */
    BiDatepickerComponent.prototype.monthChanged;
    /** @type {?} */
    BiDatepickerComponent.prototype.open;
    /** @type {?} */
    BiDatepickerComponent.prototype.dateSelected;
    /** @type {?} */
    BiDatepickerComponent.prototype.minDate;
    /** @type {?} */
    BiDatepickerComponent.prototype.maxDate;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class BiDatepickerModule {
}
BiDatepickerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [BiDatepickerComponent, WeekComponent, MonthComponent, CalendarComponent],
                imports: [
                    CommonModule,
                    //BrowserAnimationsModule,
                    FlexLayoutModule,
                    MatIconModule,
                    MatInputModule,
                    MatTooltipModule
                ],
                exports: [BiDatepickerComponent, CalendarComponent]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function Annotation() { }
if (false) {
    /** @type {?} */
    Annotation.prototype.id;
    /** @type {?} */
    Annotation.prototype.day;
    /** @type {?} */
    Annotation.prototype.text;
    /** @type {?} */
    Annotation.prototype.highlight;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function Annotations() { }
if (false) {
    /** @type {?} */
    Annotations.prototype.year;
    /** @type {?} */
    Annotations.prototype.month;
    /** @type {?} */
    Annotations.prototype.annotations;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function Holiday() { }
if (false) {
    /** @type {?} */
    Holiday.prototype.day;
    /** @type {?} */
    Holiday.prototype.name;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function Holidays() { }
if (false) {
    /** @type {?} */
    Holidays.prototype.year;
    /** @type {?} */
    Holidays.prototype.month;
    /** @type {?} */
    Holidays.prototype.holidays;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function MonthYear() { }
if (false) {
    /** @type {?} */
    MonthYear.prototype.year;
    /** @type {?} */
    MonthYear.prototype.month;
    /** @type {?} */
    MonthYear.prototype.annotation;
    /** @type {?} */
    MonthYear.prototype.holidays;
    /** @type {?} */
    MonthYear.prototype.component;
    /** @type {?} */
    MonthYear.prototype.id;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { BiDatepickerComponent, BiDatepickerModule, CalendarComponent, MonthComponent, WeekComponent, BiDatepickerService as ɵa };
//# sourceMappingURL=bi-datepicker.js.map
