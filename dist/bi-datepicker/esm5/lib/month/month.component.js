/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ViewChildren, QueryList, Output, EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';
import * as momentimp from 'moment';
import { WeekComponent } from '../week/week.component';
import { BiDatepickerService } from '../bi-datepicker.service';
/** @type {?} */
var moment = momentimp;
var MonthComponent = /** @class */ (function () {
    function MonthComponent(zone, ref, service) {
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
    MonthComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        this.generateWeeks();
    };
    /**
     * @return {?}
     */
    MonthComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.generateWeeks();
    };
    /**
     * @return {?}
     */
    MonthComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @param {?} hld
     * @return {?}
     */
    MonthComponent.prototype.addHolidays = /**
     * @param {?} hld
     * @return {?}
     */
    function (hld) {
        var _this = this;
        this.holidays = hld;
        /** @type {?} */
        var hlds = [];
        if (this.holidays && this.holidays.holidays) {
            if (this.holidays.holidays.length > 0) {
                this.cmpWeeks.forEach((/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) {
                    /** @type {?} */
                    var h = _this.holidays.holidays.filter((/**
                     * @param {?} x
                     * @return {?}
                     */
                    function (x) { return d.week.filter((/**
                     * @param {?} w
                     * @return {?}
                     */
                    function (w) { return parseInt(w.day) === parseInt(x.day); })).length > 0; }));
                    if (h.length > 0) {
                        d.addHolidays(h);
                        //hlds.push(h[0]);
                    }
                }));
            }
        }
        this.ref.detectChanges();
        //return hlds;
    };
    /**
     * @param {?} ann
     * @return {?}
     */
    MonthComponent.prototype.addAnnotations = /**
     * @param {?} ann
     * @return {?}
     */
    function (ann) {
        var _this = this;
        this.annotation = ann;
        /** @type {?} */
        var anns = [];
        if (this.annotation && this.annotation.annotations) {
            if (this.annotation.annotations.length > 0) {
                this.cmpWeeks.forEach((/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) {
                    /** @type {?} */
                    var h = _this.annotation.annotations.filter((/**
                     * @param {?} x
                     * @return {?}
                     */
                    function (x) { return d.week.filter((/**
                     * @param {?} w
                     * @return {?}
                     */
                    function (w) { return w.day === x.day; })).length > 0; }));
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
    };
    /**
     * @private
     * @return {?}
     */
    MonthComponent.prototype.generateWeeks = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        // console.log('generating weeks', this.month);
        /** @type {?} */
        var cal = moment().year(this.year).month(this.month - 1).startOf('month');
        /** @type {?} */
        var startDay = parseInt(cal.format('d'), 10);
        /** @type {?} */
        var endDay = cal.daysInMonth();
        this.monthName = cal.format('MMMM');
        /** @type {?} */
        var prevEndDay = cal.subtract(1, "month").daysInMonth();
        /** @type {?} */
        var weekdays = [];
        /** @type {?} */
        var monthCache = this.service.getMonth(cal.format("YYYYMM"));
        if (monthCache == null) {
            weekdays.push([]);
            /** @type {?} */
            var dateIn = this.Date.split('-');
            /** @type {?} */
            var dmIn = parseInt(dateIn[1]);
            /** @type {?} */
            var dyIn = parseInt(dateIn[2]);
            /** @type {?} */
            var ddIn = parseInt(dateIn[0]);
            /** @type {?} */
            var c1 = 1;
            // Previous Month filling in current month
            for (var i = prevEndDay - startDay + 1, j = startDay; j > 0; i++, j--) {
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
            var c = 1;
            /** @type {?} */
            var cdate = moment().startOf('day');
            //current month after previous month;
            for (var i = startDay; i < 7; i++) {
                cal = cal.year(this.year).month(this.month - 1).date(c).startOf('day');
                /** @type {?} */
                var act = true;
                /** @type {?} */
                var act1 = true;
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
            var cm = true;
            for (var i = 1; i < 6; i++) {
                weekdays.push([]);
                for (var j = 0; j < 7; j++) {
                    cal = cal.year(this.year).month(this.month - 1).date(c).startOf('day');
                    /** @type {?} */
                    var act = true;
                    /** @type {?} */
                    var act1 = true;
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
        function (w, index) {
            return {
                id: _this.year.toString() + _this.month.toString() + index.toString(),
                weekdays: w
            };
        }));
    };
    /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    MonthComponent.prototype.trackByFn = /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    function (index, item) {
        return item.id;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    MonthComponent.prototype.onDateSelected = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        this.dateSelected.emit(date);
    };
    MonthComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bi-month',
                    template: "<div>\r\n    <div class=\"month-head\" [ngClass]=\"{'mobile':vertical}\">{{monthName}} <span>{{year}}</span> </div>\r\n    <div fxFlexLayout=\"row\" fxLayoutAlign=\"space-evenly center\" class=\"day-name\" [ngClass]=\"{'mobile':vertical}\">\r\n        <div>Sun</div>\r\n        <div>Mon</div>\r\n        <div>Tue</div>\r\n        <div>Wed</div>\r\n        <div>Thu</div>\r\n        <div>Fri</div>\r\n        <div>Sat</div>\r\n\r\n    </div>\r\n    <bi-week *ngFor=\"let w of weekWithId;let i=index; trackBy: trackByFn\" [week]=\"w.weekdays\"\r\n        (dateSelected)=\"onDateSelected($event)\" [vertical]=\"vertical\" [currency]='currency'\r\n        [currencySymbol]='currencySymbol'></bi-week>\r\n    <div class=\"strips\" *ngIf=\"vertical== true && holidays\">\r\n        <div class=\"scrolldiv\">\r\n            <ul *ngIf=\"holidays\">\r\n                <li *ngFor=\"let hld of holidays.holidays;\">\r\n                    <h5><span>{{hld.day}}</span> -{{hld.name}}</h5>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</div>",
                    styles: [".month-head{text-align:center;font-size:14px;font-weight:700;color:#d32f2f;text-transform:uppercase;padding:15px 0}.month-head.mobile{color:#000;font-weight:400;text-transform:capitalize;font-size:17px}.month-head.mobile span{font-weight:700}.day-name.mobile{background:#fff;box-shadow:0 5px 8px -3px rgba(0,0,0,.1);margin:0 -15px 15px;padding:0 15px}.day-name{background-color:#f5f5f5}.day-name div{height:38px;width:41px;padding:0;margin:0;text-align:center;font-weight:700;line-height:41px;color:#000;font-size:13px;text-transform:capitalize}.strips{background:#fee;padding:0 15px;margin:13px -15px 0}.strips ul{text-align:left;white-space:nowrap}.strips ul li{padding:0 0 0 10px;position:relative;list-style-type:none;display:inline-block;margin-right:15px}.strips ul li:last-child{margin:0}.strips ul li h5{font-size:13px;color:#5a5a58;font-weight:400}.strips ul li h5 span{font-weight:500;color:#000}.strips ul li::before{content:'';left:0;top:6px;width:5px;height:5px;border-radius:50%;background:#d32f2e;position:absolute;z-index:1}.scrolldiv{overflow:hidden;overflow-x:auto;width:100%;padding:12px 0}"]
                }] }
    ];
    /** @nocollapse */
    MonthComponent.ctorParameters = function () { return [
        { type: NgZone },
        { type: ChangeDetectorRef },
        { type: BiDatepickerService }
    ]; };
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
    return MonthComponent;
}());
export { MonthComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGguY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmktZGF0ZXBpY2tlci8iLCJzb3VyY2VzIjpbImxpYi9tb250aC9tb250aC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUF5QixZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUU1SyxPQUFPLEtBQUssU0FBUyxNQUFNLFFBQVEsQ0FBQztBQUNwQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFLdkQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7O0lBR3pELE1BQU0sR0FBRyxTQUFTO0FBR3hCO0lBVUksd0JBQW9CLElBQVksRUFBVSxHQUFzQixFQUFVLE9BQTRCO1FBQWxGLFNBQUksR0FBSixJQUFJLENBQVE7UUFBVSxRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQXFCO1FBSzVGLGlCQUFZLEdBQVcsSUFBSSxDQUFDO1FBSTdCLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBQzFCLGtCQUFhLEdBQVcsRUFBRSxDQUFDO1FBT3BDLGlCQUFZLEdBQXlCLElBQUksWUFBWSxFQUFFLENBQUM7UUFRakQsVUFBSyxHQUFZLEVBQUUsQ0FBQztRQUNwQixjQUFTLEdBQVcsRUFBRSxDQUFDO1FBQzlCLGVBQVUsR0FBRyxFQUFFLENBQUM7SUExQmhCLENBQUM7Ozs7O0lBTEQsb0NBQVc7Ozs7SUFBWCxVQUFZLE9BQXNCO1FBQzlCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN6QixDQUFDOzs7O0lBcUJELGlDQUFROzs7SUFBUjtRQUNJLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN6QixDQUFDOzs7O0lBQ0Qsd0NBQWU7OztJQUFmO0lB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S0FBSyxFQUFFLElBQUk7UUFDakIsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ25CLENBQUM7Ozs7O0lBQ0QsdUNBQWM7Ozs7SUFBZCxVQUFlLElBQVk7UUFDdkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFakMsQ0FBQzs7Z0JBdE5KLFNBQVMsU0FBQztvQkFDUCxRQUFRLEVBQUUsVUFBVTtvQkFFcEIsb2pDQUFtQzs7aUJBQ3RDOzs7O2dCQWxCZ0csTUFBTTtnQkFBRSxpQkFBaUI7Z0JBUWpILG1CQUFtQjs7OzJCQW1CdkIsWUFBWSxTQUFDLGFBQWE7K0JBRTFCLEtBQUs7dUJBQ0wsS0FBSzt3QkFDTCxLQUFLO3VCQUNMLEtBQUs7K0JBQ0wsS0FBSztnQ0FDTCxLQUFLOzBCQUNMLEtBQUs7MEJBQ0wsS0FBSzsyQkFDTCxLQUFLOzJCQUNMLEtBQUs7aUNBQ0wsS0FBSzsrQkFDTCxNQUFNOztJQTZMWCxxQkFBQztDQUFBLEFBdk5ELElBdU5DO1NBbE5ZLGNBQWM7OztJQVF2QixrQ0FDbUM7O0lBQ25DLHNDQUFzQzs7SUFDdEMsOEJBQXNCOztJQUN0QiwrQkFBdUI7O0lBQ3ZCLDhCQUFzQjs7SUFDdEIsc0NBQW1DOztJQUNuQyx1Q0FBb0M7O0lBQ3BDLGlDQUF5Qjs7SUFDekIsaUNBQXlCOztJQUN6QixrQ0FBMkI7O0lBQzNCLGtDQUEyQjs7SUFDM0Isd0NBQWlDOztJQUNqQyxzQ0FDd0Q7O0lBUXhELCtCQUEyQjs7SUFDM0IsbUNBQThCOztJQUM5QixvQ0FBZ0I7O0lBSWhCLG9DQUF3Qjs7SUFFeEIsa0NBQW1COzs7OztJQWpDUCw4QkFBb0I7Ozs7O0lBQUUsNkJBQThCOzs7OztJQUFFLGlDQUFvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgVmlld0NoaWxkcmVuLCBRdWVyeUxpc3QsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBOZ1pvbmUsIENoYW5nZURldGVjdG9yUmVmLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRGF5IH0gZnJvbSAnLi4vbW9kZWxzL2RheSc7XHJcbmltcG9ydCAqIGFzIG1vbWVudGltcCBmcm9tICdtb21lbnQnO1xyXG5pbXBvcnQgeyBXZWVrQ29tcG9uZW50IH0gZnJvbSAnLi4vd2Vlay93ZWVrLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFubm90YXRpb25zIH0gZnJvbSAnLi4vbW9kZWxzL2Fubm90YXRpb25zJztcclxuaW1wb3J0IHsgSG9saWRheXMgfSBmcm9tICcuLi9tb2RlbHMvaG9saWRheXMnO1xyXG5pbXBvcnQgeyBIb2xpZGF5IH0gZnJvbSAnLi4vbW9kZWxzL2hvbGlkYXknO1xyXG5pbXBvcnQgeyBBbm5vdGF0aW9uIH0gZnJvbSAnLi4vbW9kZWxzL2Fubm90YXRpb24nO1xyXG5pbXBvcnQgeyBCaURhdGVwaWNrZXJTZXJ2aWNlIH0gZnJvbSAnLi4vYmktZGF0ZXBpY2tlci5zZXJ2aWNlJztcclxuXHJcblxyXG5jb25zdCBtb21lbnQgPSBtb21lbnRpbXA7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2JpLW1vbnRoJyxcclxuICAgIHN0eWxlVXJsczogWydtb250aC5jb21wb25lbnQuY3NzJ10sXHJcbiAgICB0ZW1wbGF0ZVVybDogJ21vbnRoLmNvbXBvbmVudC5odG1sJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTW9udGhDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcyB7XHJcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVdlZWtzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSB6b25lOiBOZ1pvbmUsIHByaXZhdGUgcmVmOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSBzZXJ2aWNlOiBCaURhdGVwaWNrZXJTZXJ2aWNlKSB7XHJcbiAgICB9XHJcblxyXG4gICAgQFZpZXdDaGlsZHJlbihXZWVrQ29tcG9uZW50KVxyXG4gICAgY21wV2Vla3M6IFF1ZXJ5TGlzdDxXZWVrQ29tcG9uZW50PjtcclxuICAgIEBJbnB1dCgpICBzaG93U2VsZWN0ZWQ6Ym9vbGVhbiA9IHRydWU7XHJcbiAgICBASW5wdXQoKSBEYXRlOiBTdHJpbmc7XHJcbiAgICBASW5wdXQoKSBtb250aDogbnVtYmVyO1xyXG4gICAgQElucHV0KCkgeWVhcjogbnVtYmVyO1xyXG4gICAgQElucHV0KCkgd2Vla2VuZENsYXNzOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgQElucHV0KCkgaW5BY3RpdmVDbGFzczogc3RyaW5nID0gXCJcIjtcclxuICAgIEBJbnB1dCgpIG1pbkRhdGU6IG51bWJlcjtcclxuICAgIEBJbnB1dCgpIG1heERhdGU6IG51bWJlcjtcclxuICAgIEBJbnB1dCgpIHZlcnRpY2FsOiBib29sZWFuO1xyXG4gICAgQElucHV0KCkgY3VycmVuY3k/OiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBjdXJyZW5jeVN5bWJvbD86IHN0cmluZztcclxuICAgIEBPdXRwdXQoKVxyXG4gICAgZGF0ZVNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8U3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdlbmVyYXRlV2Vla3MoKTtcclxuICAgIH1cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgd2Vla3M6IERheVtdW10gPSBbXTtcclxuICAgIHB1YmxpYyBtb250aE5hbWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICB3ZWVrV2l0aElkID0gW107XHJcblxyXG5cclxuICAgIC8vQElucHV0KClcclxuICAgIGFubm90YXRpb246IEFubm90YXRpb25zO1xyXG4gICAgLy8gQElucHV0KClcclxuICAgIGhvbGlkYXlzOiBIb2xpZGF5cztcclxuXHJcbiAgICBhZGRIb2xpZGF5cyhobGQ6IEhvbGlkYXlzKSB7XHJcbiAgICAgICAgdGhpcy5ob2xpZGF5cyA9IGhsZDtcclxuICAgICAgICBsZXQgaGxkczogSG9saWRheVtdID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuaG9saWRheXMgJiYgdGhpcy5ob2xpZGF5cy5ob2xpZGF5cykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ob2xpZGF5cy5ob2xpZGF5cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNtcFdlZWtzLmZvckVhY2goKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaDogSG9saWRheVtdID0gdGhpcy5ob2xpZGF5cy5ob2xpZGF5cy5maWx0ZXIoKHgpID0+IGQud2Vlay5maWx0ZXIoKHcpID0+IHBhcnNlSW50KHcuZGF5KSA9PT0gcGFyc2VJbnQoeC5kYXkpKS5sZW5ndGggPiAwKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQuYWRkSG9saWRheXMoaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaGxkcy5wdXNoKGhbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICAgIC8vcmV0dXJuIGhsZHM7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQW5ub3RhdGlvbnMoYW5uOiBBbm5vdGF0aW9ucykge1xyXG5cclxuICAgICAgICB0aGlzLmFubm90YXRpb24gPSBhbm47XHJcbiAgICAgICAgbGV0IGFubnM6IEFubm90YXRpb25bXSA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLmFubm90YXRpb24gJiYgdGhpcy5hbm5vdGF0aW9uLmFubm90YXRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFubm90YXRpb24uYW5ub3RhdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbXBXZWVrcy5mb3JFYWNoKChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGg6IEFubm90YXRpb25bXSA9IHRoaXMuYW5ub3RhdGlvbi5hbm5vdGF0aW9ucy5maWx0ZXIoKHgpID0+IGQud2Vlay5maWx0ZXIoKHcpID0+IHcuZGF5ID09PSB4LmRheSkubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGgubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkLmFkZEFubm90YXRpb24oaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaGxkcy5wdXNoKGhbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL2RbJ3J1bnRpbWUnXSA9ICd0aGVuZ2EnO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuY21wV2Vla3MpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vcmV0dXJuIGhsZHM7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZVdlZWtzKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdnZW5lcmF0aW5nIHdlZWtzJywgdGhpcy5tb250aCk7XHJcbiAgICAgICAgbGV0IGNhbCA9IG1vbWVudCgpLnllYXIodGhpcy55ZWFyKS5tb250aCh0aGlzLm1vbnRoIC0gMSkuc3RhcnRPZignbW9udGgnKTtcclxuICAgICAgICBsZXQgc3RhcnREYXk6IG51bWJlciA9IHBhcnNlSW50KGNhbC5mb3JtYXQoJ2QnKSwgMTApO1xyXG4gICAgICAgIGxldCBlbmREYXk6IG51bWJlciA9IGNhbC5kYXlzSW5Nb250aCgpO1xyXG4gICAgICAgIHRoaXMubW9udGhOYW1lID0gY2FsLmZvcm1hdCgnTU1NTScpO1xyXG4gICAgICAgIHZhciBwcmV2RW5kRGF5ID0gY2FsLnN1YnRyYWN0KDEsIFwibW9udGhcIikuZGF5c0luTW9udGgoKTtcclxuXHJcbiAgICAgICAgbGV0IHdlZWtkYXlzOiBEYXlbXVtdID0gW107XHJcbiAgICAgICAgbGV0IG1vbnRoQ2FjaGU6IERheVtdW10gPSB0aGlzLnNlcnZpY2UuZ2V0TW9udGgoY2FsLmZvcm1hdChcIllZWVlNTVwiKSk7XHJcbiAgICAgICAgaWYgKG1vbnRoQ2FjaGUgPT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgd2Vla2RheXMucHVzaChbXSk7XHJcbiAgICAgICAgICAgIGxldCBkYXRlSW46IHN0cmluZ1tdID0gdGhpcy5EYXRlLnNwbGl0KCctJyk7XHJcbiAgICAgICAgICAgIGxldCBkbUluOiBudW1iZXIgPSBwYXJzZUludChkYXRlSW5bMV0pO1xyXG4gICAgICAgICAgICBsZXQgZHlJbjogbnVtYmVyID0gcGFyc2VJbnQoZGF0ZUluWzJdKTtcclxuICAgICAgICAgICAgbGV0IGRkSW46IG51bWJlciA9IHBhcnNlSW50KGRhdGVJblswXSk7XHJcbiAgICAgICAgICAgIGxldCBjMTogbnVtYmVyID0gMTtcclxuICAgICAgICAgICAgLy8gUHJldmlvdXMgTW9udGggZmlsbGluZyBpbiBjdXJyZW50IG1vbnRoXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBwcmV2RW5kRGF5IC0gc3RhcnREYXkgKyAxLCBqID0gc3RhcnREYXk7IGogPiAwOyBpKyssIGotLSkge1xyXG4gICAgICAgICAgICAgICAgd2Vla2RheXNbMF0ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHRoaXMueWVhci50b1N0cmluZygpICsgdGhpcy5tb250aC50b1N0cmluZygpICsgaS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRheTogaS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vbnRoOiB0aGlzLm1vbnRoLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgeWVhcjogdGhpcy55ZWFyLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgaXNDdXJyZW50TW9udGg6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkOnRoaXMuc2hvd1NlbGVjdGVkICYmICggKHRoaXMubW9udGggPT0gZG1JbiAmJiB0aGlzLnllYXIgPT0gZHlJbiAmJiBkZEluID09IChjMSAtIDEpKSksXHJcbiAgICAgICAgICAgICAgICAgICAgaXNXZWVrZW5kOiB3ZWVrZGF5c1swXS5sZW5ndGggPT0gMCA/IHRydWUgOiBmYWxzZSwgLy98fCB0aGlzLndlZWtzWzBdLmxlbmd0aD09NlxyXG4gICAgICAgICAgICAgICAgICAgIGlzSG9saWRheTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9vbFRpcDogJycsXHJcbiAgICAgICAgICAgICAgICB9IGFzIERheSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh3ZWVrZGF5cywgXCJ3ZWVrZGF5c1wiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGM6IG51bWJlciA9IDE7XHJcbiAgICAgICAgICAgIGxldCBjZGF0ZSA9IG1vbWVudCgpLnN0YXJ0T2YoJ2RheScpO1xyXG4gICAgICAgICAgICAvL2N1cnJlbnQgbW9udGggYWZ0ZXIgcHJldmlvdXMgbW9udGg7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBzdGFydERheTsgaSA8IDc7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGNhbCA9IGNhbC55ZWFyKHRoaXMueWVhcikubW9udGgodGhpcy5tb250aCAtIDEpLmRhdGUoYykuc3RhcnRPZignZGF5Jyk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBhY3Q6Ym9vbGVhbiA9IHRydWUsIGFjdDE6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodGhpcy5taW5EYXRlKSAhPSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0ID0gY2FsLmRpZmYoY2RhdGUsICdkYXlzJykgPj0gdGhpcy5taW5EYXRlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodGhpcy5tYXhEYXRlKSAhPSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0MSA9IGNhbC5kaWZmKGNkYXRlLCAnZGF5cycpIDw9IHRoaXMubWF4RGF0ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2Vla2RheXNbMF0ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLnllYXIudG9TdHJpbmcoKSArIHRoaXMubW9udGgudG9TdHJpbmcoKSArIGMudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF5OiAoYysrKS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0N1cnJlbnRNb250aDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNBY3RpdmU6IGFjdCAmJiBhY3QxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aDogdGhpcy5tb250aC50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyOiB0aGlzLnllYXIudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNXZWVrZW5kOiB3ZWVrZGF5c1swXS5sZW5ndGggPT0gMCA/IHRydWUgOiBmYWxzZSwvL3x8IHRoaXMud2Vla3NbMF0ubGVuZ3RoPT02XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ6IHRoaXMuc2hvd1NlbGVjdGVkICYmICgodGhpcy5tb250aCA9PSBkbUluICYmIHRoaXMueWVhciA9PSBkeUluICYmIGRkSW4gPT0gKGMgLSAxKSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0gYXMgRGF5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgY20gPSB0cnVlO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IDY7IGkrKykge1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB3ZWVrZGF5cy5wdXNoKFtdKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgNzsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsID0gY2FsLnllYXIodGhpcy55ZWFyKS5tb250aCh0aGlzLm1vbnRoIC0gMSkuZGF0ZShjKS5zdGFydE9mKCdkYXknKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYWN0OmJvb2xlYW4gPXRydWUsIGFjdDE6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHRoaXMubWluRGF0ZSkgIT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3QgPSBjYWwuZGlmZihjZGF0ZSwgJ2RheXMnKSA+PSB0aGlzLm1pbkRhdGU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh0aGlzLm1heERhdGUpICE9IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0MSA9IGNhbC5kaWZmKGNkYXRlLCAnZGF5cycpIDw9IHRoaXMubWF4RGF0ZTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2Vla2RheXNbd2Vla2RheXMubGVuZ3RoIC0gMV0ucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy55ZWFyLnRvU3RyaW5nKCkgKyB0aGlzLm1vbnRoLnRvU3RyaW5nKCkgKyBjLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF5OiAoYysrKS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ3VycmVudE1vbnRoOiBjbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0FjdGl2ZTogYWN0ICYmIGFjdDEgJiYgY20sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IHRoaXMubW9udGgudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ZWFyOiB0aGlzLnllYXIudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1dlZWtlbmQ6IHdlZWtkYXlzW3dlZWtkYXlzLmxlbmd0aCAtIDFdLmxlbmd0aCA9PSAwID8gdHJ1ZSA6IGZhbHNlLCAvL3x8IHRoaXMud2Vla3NbdGhpcy53ZWVrcy5sZW5ndGggLSAxXS5sZW5ndGg9PTYgZm9yIHNhdHVyZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZDogdGhpcy5zaG93U2VsZWN0ZWQgJiYgKCh0aGlzLm1vbnRoID09IGRtSW4gJiYgdGhpcy55ZWFyID09IGR5SW4gJiYgZGRJbiA9PSAoYyAtIDEpICYmIGNtID09PSB0cnVlKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pc0luQmV0d2VlbjogbW9tZW50KHRoaXMueWVhciArICctJyArIHRoaXMubW9udGggKyAnLScgKyAoYyAtIDEpKS5pc0JldHdlZW4oZHlJbiArICctJyArIGRtSW4gKyAnLScgKyBkZEluLCBkeU91dCArICctJyArIGRtT3V0ICsgJy0nICsgZGRPdXQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pc0luQmV0d2VlbjogKHRoaXMubW9udGggPT1kbUluICYmIHRoaXMueWVhciA9PSBkeUluICYmIGRkSW4gPCAoYy0xKSAmJiBjbSA9PT0gdHJ1ZSApICYmICh0aGlzLm1vbnRoID09IGRtT3V0ICYmIHRoaXMueWVhciA9PSBkeU91dCAmJiBkZE91dCA+IChjLTEpICYmIGNtID09PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBEYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMgPiBlbmREYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFjbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNlcnZpY2UuYWRkTW9udGgoY2FsLmZvcm1hdChcIllZWVlNTVwiKSwgd2Vla2RheXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgd2Vla2RheXMgPSBtb250aENhY2hlO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8vIHRoaXMud2Vla3MgPSB3ZWVrZGF5cztcclxuICAgICAgICAvLyB0aGlzLnJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcblxyXG4gICAgICAgIHRoaXMud2Vla1dpdGhJZCA9IHdlZWtkYXlzLm1hcCgodywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGlkOiB0aGlzLnllYXIudG9TdHJpbmcoKSArIHRoaXMubW9udGgudG9TdHJpbmcoKSArIGluZGV4LnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICB3ZWVrZGF5czogd1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhY2tCeUZuKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW0uaWQ7XHJcbiAgICB9XHJcbiAgICBvbkRhdGVTZWxlY3RlZChkYXRlOiBTdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmRhdGVTZWxlY3RlZC5lbWl0KGRhdGUpO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuIl19