/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, PLATFORM_ID, Inject, ElementRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, NgZone, ChangeDetectorRef } from '@angular/core';
import * as momentimp from 'moment';
import { MonthComponent } from '../month/month.component';
import { fromEvent } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
/** @type {?} */
var moment = momentimp;
var CalendarComponent = /** @class */ (function () {
    function CalendarComponent(r, zone, platform, cRef) {
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
    CalendarComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        if (isPlatformBrowser(this.platform)) {
            if (this.vertical == true) {
                this.monthParent.nativeElement.scroll(0, this.slider.element.nativeElement.nextElementSibling.clientHeight * this.difference, { behavior: 'smooth' });
            }
            // console.log(this.difference, "this.difference");
        }
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.annotations = [];
        this.holidays = [];
        this.initMonths();
        if (this.vertical == true) {
            if (this.Date != undefined && this.Date.length > 0 && this.date != null) {
                this.showSelected = true;
                this.date = this.Date;
                this.difference = moment([parseInt(this.Date.split('-')[2]), parseInt(this.Date.split('-')[1]) - 1]).diff(moment([new Date().getFullYear(), new Date().getMonth()]), 'months', true);
            }
            else {
                this.showSelected = false;
                this.date = moment().format('DD-MM-YYYY');
                this.difference = moment([parseInt(this.date.split('-')[2]), parseInt(this.date.split('-')[1]) - 1]).diff(moment([new Date().getFullYear(), new Date().getMonth()]), 'months', true);
            }
            this.difference = Math.floor(this.difference);
            if (this.difference > 0) {
                for (var i = 0; i < this.difference; i++)
                    this.prevMonth(true);
            }
        }
        //this.month = Array[this.months].fill((x,i)=>cMonth++);
        // window.addEventListener('scroll', this.scrollEvent.bind(this), true);
        if (isPlatformBrowser(this.platform)) {
            this.zone.runOutsideAngular((/**
             * @return {?}
             */
            function () {
                _this.scrollSubscription = fromEvent(window, 'scroll', { passive: true, capture: true }).pipe(debounceTime(500)).subscribe((/**
                 * @param {?} e
                 * @return {?}
                 */
                function (e) {
                    _this.scrollEvent(e);
                }));
            }));
        }
    };
    /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    CalendarComponent.prototype.trackByFn = /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    function (index, item) {
        return item.id;
    };
    /**
     * @private
     * @return {?}
     */
    CalendarComponent.prototype.initMonths = /**
     * @private
     * @return {?}
     */
    function () {
        this.month = [];
        this.date = this.Date;
        if (typeof (this.Date) == "undefined" || this.Date.length == 0) {
            this.date = moment().format('DD-MM-YYYY');
            this.showSelected = false;
        }
        else {
            this.showSelected = true;
        }
        /** @type {?} */
        var m = this.date.split('-')[1];
        /** @type {?} */
        var y = this.date.split('-')[2];
        /** @type {?} */
        var cYear = parseInt(y);
        /** @type {?} */
        var cMonth = moment().set('year', cYear).set('month', parseInt(m) - 1).month() + 1;
        for (var i = 0; i < this.months; i++) {
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
    };
    /**
     * @param {?=} status
     * @return {?}
     */
    CalendarComponent.prototype.prevMonth = /**
     * @param {?=} status
     * @return {?}
     */
    function (status) {
        /** @type {?} */
        var firstMonth = this.month[0];
        /** @type {?} */
        var newMonth = (/** @type {?} */ ({ component: this }));
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
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.nextMonth = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var lastMonth = this.month[this.month.length - 1];
        /** @type {?} */
        var newMonth = (/** @type {?} */ ({ component: this }));
        /** @type {?} */
        var month = 12 - new Date().getUTCMonth() + 1;
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
    };
    /**
     * @param {?} annotation
     * @return {?}
     */
    CalendarComponent.prototype.addAnnotations = /**
     * @param {?} annotation
     * @return {?}
     */
    function (annotation) {
        var _this = this;
        this.removeAnnotations(annotation.month, annotation.year);
        this.annotations = tslib_1.__spread(this.annotations, [
            annotation
        ]);
        this.cmpMonths.map((/**
         * @param {?} m
         * @return {?}
         */
        function (m) {
            /** @type {?} */
            var hlds = _this.annotations.filter((/**
             * @param {?} x
             * @return {?}
             */
            function (x) { return x.month == m.month && x.year == m.year; }));
            if (hlds.length > 0) {
                m.addAnnotations(hlds[0]);
            }
            //     m.holidays = hlds.length > 0 ? hlds[0] : {month:m.month,year:m.year} as Holidays;
        }));
        // this.month.map((m)=>{
        //     let ann = this.annotations.filter(x=>x.month==m.month && x.year == m.year);
        //     m.annotation = ann.length > 0 ? ann[0] : {month:m.month,year:m.year} as Annotations;
        // });
    };
    /**
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    CalendarComponent.prototype.removeAnnotations = /**
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    function (month, year) {
        if (this.annotations) {
            this.annotations = this.annotations.filter((/**
             * @param {?} x
             * @return {?}
             */
            function (x) { return !(x.year == year && x.month == month); }));
        }
        else {
            this.annotations = [];
        }
    };
    /**
     * @param {?} holidays
     * @return {?}
     */
    CalendarComponent.prototype.addHolidays = /**
     * @param {?} holidays
     * @return {?}
     */
    function (holidays) {
        var _this = this;
        this.removeHolidays(holidays.month, holidays.year);
        this.holidays = tslib_1.__spread(this.holidays, [
            holidays
        ]);
        this.cmpMonths.map((/**
         * @param {?} m
         * @return {?}
         */
        function (m) {
            /** @type {?} */
            var hlds = _this.holidays.filter((/**
             * @param {?} x
             * @return {?}
             */
            function (x) { return x.month == m.month && x.year == m.year; }));
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
    };
    /**
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    CalendarComponent.prototype.removeHolidays = /**
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    function (month, year) {
        if (this.holidays) {
            this.holidays = this.holidays.filter((/**
             * @param {?} x
             * @return {?}
             */
            function (x) { return !(x.year == year && x.month == month); }));
        }
        else {
            this.holidays = [];
        }
    };
    /**
     * @param {?} date
     * @return {?}
     */
    CalendarComponent.prototype.onDateSelected = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        this.dateSelected.emit(date);
        this.date = date;
        this.showSelected = true;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    CalendarComponent.prototype.onDateChanged = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        this.date = date;
        this.showSelected = true;
    };
    /**
     * @param {?} eve
     * @return {?}
     */
    CalendarComponent.prototype.scrollEvent = /**
     * @param {?} eve
     * @return {?}
     */
    function (eve) {
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
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.scrollSubscription) {
            this.scrollSubscription.unsubscribe();
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    CalendarComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        /** @type {?} */
        var change = changes.Date || null;
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
    };
    CalendarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bi-calendar',
                    template: "<div class=\"outer\" [ngClass]=\"{'mobile':vertical}\">\r\n    <div *ngIf=\"vertical==false\" class=\"month-nav left\" (click)=\"prevMonth()\">\r\n        <mat-icon class=\"icon\">arrow_back</mat-icon>\r\n    </div>\r\n    <div fxLayoutAlign=\"space-between start\" [fxLayout]=\"vertical ? 'column' : 'row'\" class=\"monthouter\" #year>\r\n        <ng-container *ngFor=\"let m of month; trackBy: trackByFn\" #months>\r\n            <bi-month [vertical]=\"vertical\" class=\"month\" [minDate]=\"minDate\"\r\n\r\n             [maxDate]=\"maxDate\"\r\n             [showSelected]=\"showSelected\"\r\n                (dateSelected)=\"onDateSelected($event)\" [year]=\"m.year\" [month]=\"m.month\" fxFlex fxLayoutGap=\"20px\"\r\n                [Date]=\"date\" [currency]='currency'\r\n                [currencySymbol]='currencySymbol'></bi-month>\r\n        </ng-container>\r\n    </div>\r\n    <div *ngIf=\"vertical==false\" class=\"month-nav right\" (click)=\"nextMonth()\">\r\n        <mat-icon class=\"icon\">arrow_forward</mat-icon>\r\n    </div>\r\n</div>\r\n",
                    styles: [".outer{position:relative}.month-nav{font-weight:700;cursor:pointer;position:absolute;top:21px;z-index:10}.left{left:15px}.right{right:15px}.mat-icon.icon{color:grey}.month{width:50%;padding:10px 15px}.monthouter,.outer.mobile .month{width:100%}.outer.mobile .monthouter{width:100%;height:calc(100vh - 114px);overflow:hidden;overflow-y:auto;padding-bottom:100px}.outer.mobile .monthouter .month:first-child{border-right:0}"]
                }] }
    ];
    /** @nocollapse */
    CalendarComponent.ctorParameters = function () { return [
        { type: ComponentFactoryResolver },
        { type: NgZone },
        { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
        { type: ChangeDetectorRef }
    ]; };
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
    return CalendarComponent;
}());
export { CalendarComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmktZGF0ZXBpY2tlci8iLCJzb3VyY2VzIjpbImxpYi9jYWxlbmRhci9jYWxlbmRhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBaUIsVUFBVSxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSx3QkFBd0IsRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQXFELE1BQU0sZUFBZSxDQUFDO0FBQzdSLE9BQU8sS0FBSyxTQUFTLE1BQU0sUUFBUSxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUkxRCxPQUFPLEVBQUUsU0FBUyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUMvQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0lBQ3hDLE1BQU0sR0FBRyxTQUFTO0FBQ3hCO0lBOENJLDJCQUFvQixDQUEyQixFQUFVLElBQVksRUFBK0IsUUFBYSxFQUN0RyxJQUF1QjtRQURkLE1BQUMsR0FBRCxDQUFDLENBQTBCO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUErQixhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQ3RHLFNBQUksR0FBSixJQUFJLENBQW1CO1FBbEN6QixXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBSzVCLGlCQUFZLEdBQVcsRUFBRSxDQUFBO1FBU3pCLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFNMUIsaUJBQVksR0FBNEIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVwRCxVQUFLLEdBQWdCLEVBQUUsQ0FBQztRQUsvQixpQkFBWSxHQUF5QixJQUFJLFlBQVks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QixzQ0FDcUM7Ozs7O0lBQ3JDLG1DQUFpRzs7Ozs7SUFDakcsd0NBQXNFOztJQUV0RSxtQ0FBNEI7O0lBRTVCLGlDQUFzQjs7SUFFdEIseUNBQ3lCOztJQUV6QixvQ0FDZ0I7O0lBRWhCLG9DQUNnQjs7SUFFaEIscUNBQzBCOztJQUUxQixxQ0FBMkI7O0lBQzNCLDJDQUFpQzs7SUFFakMseUNBQzJEOztJQUUzRCxrQ0FBK0I7Ozs7O0lBQy9CLHdDQUFtQzs7Ozs7SUFDbkMscUNBQTZCOztJQUU3Qix5Q0FDd0Q7O0lBQ3hELGlDQUFhOztJQUNiLHVDQUF1Qjs7SUFDdkIsK0NBQWlDOztJQUNqQyx5Q0FBNkI7Ozs7O0lBRWpCLDhCQUFtQzs7Ozs7SUFBRSxpQ0FBb0I7Ozs7O0lBQUUscUNBQTBDOztJQUM3RyxpQ0FBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBWaWV3Q2hpbGRyZW4sIFF1ZXJ5TGlzdCwgUExBVEZPUk1fSUQsIEluamVjdCwgQWZ0ZXJWaWV3SW5pdCwgRWxlbWVudFJlZiwgVmlld0NoaWxkLCBWaWV3Q29udGFpbmVyUmVmLCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIE5nWm9uZSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBTaW1wbGVDaGFuZ2UgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0ICogYXMgbW9tZW50aW1wIGZyb20gJ21vbWVudCc7XHJcbmltcG9ydCB7IE1vbnRoQ29tcG9uZW50IH0gZnJvbSAnLi4vbW9udGgvbW9udGguY29tcG9uZW50JztcclxuaW1wb3J0IHsgTW9udGhZZWFyIH0gZnJvbSAnLi4vbW9kZWxzL21vbnRoeWVhcic7XHJcbmltcG9ydCB7IEFubm90YXRpb25zIH0gZnJvbSAnLi4vbW9kZWxzL2Fubm90YXRpb25zJztcclxuaW1wb3J0IHsgSG9saWRheXMgfSBmcm9tICcuLi9tb2RlbHMvaG9saWRheXMnO1xyXG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuY29uc3QgbW9tZW50ID0gbW9tZW50aW1wO1xyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnYmktY2FsZW5kYXInLFxyXG4gICAgc3R5bGVVcmxzOiBbJ2NhbGVuZGFyLmNvbXBvbmVudC5jc3MnXSxcclxuICAgIHRlbXBsYXRlVXJsOiAnY2FsZW5kYXIuY29tcG9uZW50Lmh0bWwnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDYWxlbmRhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xyXG5cclxuXHJcbiAgICBAVmlld0NoaWxkcmVuKE1vbnRoQ29tcG9uZW50KVxyXG4gICAgY21wTW9udGhzOiBRdWVyeUxpc3Q8TW9udGhDb21wb25lbnQ+O1xyXG4gICAgQFZpZXdDaGlsZCgnbW9udGhzJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmLCBzdGF0aWM6IGZhbHNlIH0pIHByaXZhdGUgc2xpZGVyOiBWaWV3Q29udGFpbmVyUmVmO1xyXG4gICAgQFZpZXdDaGlsZCgneWVhcicsIHsgc3RhdGljOiBmYWxzZSB9KSBwcml2YXRlIG1vbnRoUGFyZW50OiBFbGVtZW50UmVmO1xyXG5cclxuICAgIEBJbnB1dCgpIG1vbnRoczogbnVtYmVyID0gMTtcclxuXHJcbiAgICBASW5wdXQoKSBEYXRlOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHdlZWtlbmRDbGFzczogc3RyaW5nID0gXCJcIlxyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBtaW5EYXRlOiBudW1iZXI7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIG1heERhdGU6IG51bWJlcjtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgdmVydGljYWw6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBASW5wdXQoKSBjdXJyZW5jeT86IHN0cmluZztcclxuICAgIEBJbnB1dCgpIGN1cnJlbmN5U3ltYm9sPzogc3RyaW5nO1xyXG5cclxuICAgIEBPdXRwdXQoKVxyXG4gICAgbW9udGhDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8TW9udGhZZWFyPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBwdWJsaWMgbW9udGg6IE1vbnRoWWVhcltdID0gW107XHJcbiAgICBwcml2YXRlIGFubm90YXRpb25zOiBBbm5vdGF0aW9uc1tdO1xyXG4gICAgcHJpdmF0ZSBob2xpZGF5czogSG9saWRheXNbXTtcclxuXHJcbiAgICBAT3V0cHV0KClcclxuICAgIGRhdGVTZWxlY3RlZDogRXZlbnRFbWl0dGVyPFN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICBkYXRlOiBzdHJpbmc7XHJcbiAgICBkaWZmZXJlbmNlOiBudW1iZXIgPSAwO1xyXG4gICAgc2Nyb2xsU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgICBzaG93U2VsZWN0ZWQ6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBwcml2YXRlIHpvbmU6IE5nWm9uZSwgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybTogYW55LFxyXG4gICAgICAgIHB1YmxpYyBjUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikgeyB9XHJcblxyXG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtKSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbCA9PSB0cnVlKSB7IHRoaXMubW9udGhQYXJlbnQubmF0aXZlRWxlbWVudC5zY3JvbGwoMCwgdGhpcy5zbGlkZXIuZWxlbWVudC5uYXRpdmVFbGVtZW50Lm5leHRFbGVtZW50U2libGluZy5jbGllbnRIZWlnaHQgKiB0aGlzLmRpZmZlcmVuY2UsIHsgYmVoYXZpb3I6ICdzbW9vdGgnIH0pOyB9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuZGlmZmVyZW5jZSwgXCJ0aGlzLmRpZmZlcmVuY2VcIik7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB0aGlzLmFubm90YXRpb25zID0gW107XHJcbiAgICAgICAgdGhpcy5ob2xpZGF5cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaW5pdE1vbnRocygpO1xyXG4gICAgICAgIGlmICh0aGlzLnZlcnRpY2FsID09IHRydWUpIHtcclxuICAgICAgICAgIGlmKHRoaXMuRGF0ZSE9dW5kZWZpbmVkICYmIHRoaXMuRGF0ZS5sZW5ndGg+MCAmJiB0aGlzLmRhdGUhPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLnNob3dTZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0ZSA9IHRoaXMuRGF0ZTtcclxuICAgICAgICAgICAgdGhpcy5kaWZmZXJlbmNlID0gbW9tZW50KFtwYXJzZUludCh0aGlzLkRhdGUuc3BsaXQoJy0nKVsyXSksIHBhcnNlSW50KHRoaXMuRGF0ZS5zcGxpdCgnLScpWzFdKSAtIDFdKS5kaWZmKG1vbWVudChbbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLCBuZXcgRGF0ZSgpLmdldE1vbnRoKCldKSwgJ21vbnRocycsIHRydWUpO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1NlbGVjdGVkICA9ZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0ZSA9IG1vbWVudCgpLmZvcm1hdCgnREQtTU0tWVlZWScpO1xyXG4gICAgICAgICAgICB0aGlzLmRpZmZlcmVuY2UgPSBtb21lbnQoW3BhcnNlSW50KHRoaXMuZGF0ZS5zcGxpdCgnLScpWzJdKSwgcGFyc2VJbnQodGhpcy5kYXRlLnNwbGl0KCctJylbMV0pIC0gMV0pLmRpZmYobW9tZW50KFtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksIG5ldyBEYXRlKCkuZ2V0TW9udGgoKV0pLCAnbW9udGhzJywgdHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZGlmZmVyZW5jZSA9IE1hdGguZmxvb3IodGhpcy5kaWZmZXJlbmNlKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGlmZmVyZW5jZSA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kaWZmZXJlbmNlOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2TW9udGgodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy90aGlzLm1vbnRoID0gQXJyYXlbdGhpcy5tb250aHNdLmZpbGwoKHgsaSk9PmNNb250aCsrKTtcclxuICAgICAgICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5zY3JvbGxFdmVudC5iaW5kKHRoaXMpLCB0cnVlKTtcclxuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybSkpIHtcclxuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsU3Vic2NyaXB0aW9uID0gZnJvbUV2ZW50KHdpbmRvdywgJ3Njcm9sbCcsIHsgcGFzc2l2ZTogdHJ1ZSwgY2FwdHVyZTogdHJ1ZSB9KS5waXBlKGRlYm91bmNlVGltZSg1MDApKS5zdWJzY3JpYmUoZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxFdmVudChlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB0cmFja0J5Rm4oaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gaXRlbS5pZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRNb250aHMoKSB7XHJcbiAgICAgIHRoaXMubW9udGggPSBbXTtcclxuICAgICAgdGhpcy5kYXRlID0gdGhpcy5EYXRlO1xyXG4gICAgICBpZiAodHlwZW9mICh0aGlzLkRhdGUpID09IFwidW5kZWZpbmVkXCIgfHwgdGhpcy5EYXRlLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gbW9tZW50KCkuZm9ybWF0KCdERC1NTS1ZWVlZJyk7XHJcbiAgICAgICAgdGhpcy5zaG93U2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy5zaG93U2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBtID0gdGhpcy5kYXRlLnNwbGl0KCctJylbMV07XHJcbiAgICAgICAgbGV0IHkgPSB0aGlzLmRhdGUuc3BsaXQoJy0nKVsyXTtcclxuICAgICAgICBsZXQgY1llYXI6IG51bWJlciA9IHBhcnNlSW50KHkpO1xyXG4gICAgICAgIGxldCBjTW9udGggPSBtb21lbnQoKS5zZXQoJ3llYXInLCBjWWVhcikuc2V0KCdtb250aCcsIHBhcnNlSW50KG0pIC0gMSkubW9udGgoKSArIDE7IC8vcGFyc2VJbnQoIG1vbWVudCgpLmZvcm1hdCgnTScpKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubW9udGhzOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5tb250aC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGlkOiBjWWVhciArICcnICsgY01vbnRoLFxyXG4gICAgICAgICAgICAgICAgeWVhcjogY1llYXIsXHJcbiAgICAgICAgICAgICAgICBtb250aDogY01vbnRoXHJcbiAgICAgICAgICAgIH0gYXMgTW9udGhZZWFyKTtcclxuICAgICAgICAgICAgdGhpcy5tb250aENoYW5nZWQuZW1pdCh7XHJcbiAgICAgICAgICAgICAgICB5ZWFyOiBjWWVhcixcclxuICAgICAgICAgICAgICAgIG1vbnRoOiBjTW9udGgsXHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6IHRoaXNcclxuICAgICAgICAgICAgfSBhcyBNb250aFllYXIpO1xyXG4gICAgICAgICAgICBjTW9udGgrKztcclxuICAgICAgICAgICAgaWYgKGNNb250aCA+IDEyKSB7XHJcbiAgICAgICAgICAgICAgICBjTW9udGggPSAxO1xyXG4gICAgICAgICAgICAgICAgY1llYXIrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcmV2TW9udGgoc3RhdHVzPykge1xyXG4gICAgICAgIGxldCBmaXJzdE1vbnRoOiBNb250aFllYXIgPSB0aGlzLm1vbnRoWzBdO1xyXG4gICAgICAgIGxldCBuZXdNb250aDogTW9udGhZZWFyID0geyBjb21wb25lbnQ6IHRoaXMgfSBhcyBNb250aFllYXI7XHJcblxyXG4gICAgICAgIGlmIChmaXJzdE1vbnRoLm1vbnRoID09PSBuZXcgRGF0ZSgpLmdldFVUQ01vbnRoKCkgKyAxICYmIGZpcnN0TW9udGgueWVhciA9PT0gbmV3IERhdGUoKS5nZXRVVENGdWxsWWVhcigpKSB7IH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGZpcnN0TW9udGgubW9udGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIG5ld01vbnRoLm1vbnRoID0gMTI7XHJcbiAgICAgICAgICAgICAgICBuZXdNb250aC55ZWFyID0gZmlyc3RNb250aC55ZWFyIC0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5ld01vbnRoLm1vbnRoID0gZmlyc3RNb250aC5tb250aCAtIDE7XHJcbiAgICAgICAgICAgICAgICBuZXdNb250aC55ZWFyID0gZmlyc3RNb250aC55ZWFyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5ld01vbnRoLmlkID0gbmV3TW9udGgueWVhci50b1N0cmluZygpICsgbmV3TW9udGgubW9udGgudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vbnRoLnVuc2hpZnQobmV3TW9udGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb250aC5wb3AoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9udGgudW5zaGlmdChuZXdNb250aCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNSZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb250aENoYW5nZWQuZW1pdChuZXdNb250aCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmV4dE1vbnRoKCkge1xyXG4gICAgICAgIGxldCBsYXN0TW9udGg6IE1vbnRoWWVhciA9IHRoaXMubW9udGhbdGhpcy5tb250aC5sZW5ndGggLSAxXTtcclxuICAgICAgICBsZXQgbmV3TW9udGg6IE1vbnRoWWVhciA9IHsgY29tcG9uZW50OiB0aGlzIH0gYXMgTW9udGhZZWFyO1xyXG4gICAgICAgIGxldCBtb250aCA9IDEyIC0gbmV3IERhdGUoKS5nZXRVVENNb250aCgpICsgMVxyXG4gICAgICAgIGlmICgobW9udGggPT09IDExICYmIGxhc3RNb250aC5tb250aCA9PT0gMTIgJiYgdGhpcy5tb250aCAmJiB0aGlzLm1vbnRoLmxlbmd0aCA+IDEyKSB8fCAobGFzdE1vbnRoLm1vbnRoID49IG5ldyBEYXRlKCkuZ2V0VVRDTW9udGgoKSArIDEgJiYgbGFzdE1vbnRoLnllYXIgPT0gbmV3IERhdGUoKS5nZXRVVENGdWxsWWVhcigpICsgMSkpIHsgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobGFzdE1vbnRoLm1vbnRoID4gMTEpIHtcclxuICAgICAgICAgICAgICAgIG5ld01vbnRoLm1vbnRoID0gMTtcclxuICAgICAgICAgICAgICAgIG5ld01vbnRoLnllYXIgPSBsYXN0TW9udGgueWVhciArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXdNb250aC5tb250aCA9IGxhc3RNb250aC5tb250aCArIDE7XHJcbiAgICAgICAgICAgICAgICBuZXdNb250aC55ZWFyID0gbGFzdE1vbnRoLnllYXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZlcnRpY2FsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vbnRoLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmV3TW9udGhbJ2lkJ10gPSBuZXdNb250aC55ZWFyICsgJycgKyBuZXdNb250aC5tb250aDtcclxuICAgICAgICAgICAgdGhpcy5tb250aC5wdXNoKG5ld01vbnRoKTtcclxuICAgICAgICAgICAgdGhpcy5jUmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5tb250aENoYW5nZWQuZW1pdChuZXdNb250aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZEFubm90YXRpb25zKGFubm90YXRpb246IEFubm90YXRpb25zKSB7XHJcblxyXG4gICAgICAgIHRoaXMucmVtb3ZlQW5ub3RhdGlvbnMoYW5ub3RhdGlvbi5tb250aCwgYW5ub3RhdGlvbi55ZWFyKTtcclxuICAgICAgICB0aGlzLmFubm90YXRpb25zID0gW1xyXG4gICAgICAgICAgICAuLi50aGlzLmFubm90YXRpb25zLFxyXG4gICAgICAgICAgICBhbm5vdGF0aW9uXHJcbiAgICAgICAgXTtcclxuICAgICAgICB0aGlzLmNtcE1vbnRocy5tYXAoKG0pID0+IHtcclxuICAgICAgICAgICAgbGV0IGhsZHMgPSB0aGlzLmFubm90YXRpb25zLmZpbHRlcih4ID0+IHgubW9udGggPT0gbS5tb250aCAmJiB4LnllYXIgPT0gbS55ZWFyKTtcclxuICAgICAgICAgICAgaWYgKGhsZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbS5hZGRBbm5vdGF0aW9ucyhobGRzWzBdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgbS5ob2xpZGF5cyA9IGhsZHMubGVuZ3RoID4gMCA/IGhsZHNbMF0gOiB7bW9udGg6bS5tb250aCx5ZWFyOm0ueWVhcn0gYXMgSG9saWRheXM7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyB0aGlzLm1vbnRoLm1hcCgobSk9PntcclxuXHJcblxyXG4gICAgICAgIC8vICAgICBsZXQgYW5uID0gdGhpcy5hbm5vdGF0aW9ucy5maWx0ZXIoeD0+eC5tb250aD09bS5tb250aCAmJiB4LnllYXIgPT0gbS55ZWFyKTtcclxuICAgICAgICAvLyAgICAgbS5hbm5vdGF0aW9uID0gYW5uLmxlbmd0aCA+IDAgPyBhbm5bMF0gOiB7bW9udGg6bS5tb250aCx5ZWFyOm0ueWVhcn0gYXMgQW5ub3RhdGlvbnM7XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICB9XHJcbiAgICByZW1vdmVBbm5vdGF0aW9ucyhtb250aDogbnVtYmVyLCB5ZWFyOiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYW5ub3RhdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5hbm5vdGF0aW9ucyA9IHRoaXMuYW5ub3RhdGlvbnMuZmlsdGVyKCh4KSA9PiAhKHgueWVhciA9PSB5ZWFyICYmIHgubW9udGggPT0gbW9udGgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5ub3RhdGlvbnMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhZGRIb2xpZGF5cyhob2xpZGF5czogSG9saWRheXMpIHtcclxuXHJcbiAgICAgICAgdGhpcy5yZW1vdmVIb2xpZGF5cyhob2xpZGF5cy5tb250aCwgaG9saWRheXMueWVhcik7XHJcblxyXG4gICAgICAgIHRoaXMuaG9saWRheXMgPSBbXHJcbiAgICAgICAgICAgIC4uLnRoaXMuaG9saWRheXMsXHJcbiAgICAgICAgICAgIGhvbGlkYXlzXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdGhpcy5jbXBNb250aHMubWFwKChtKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBobGRzID0gdGhpcy5ob2xpZGF5cy5maWx0ZXIoeCA9PiB4Lm1vbnRoID09IG0ubW9udGggJiYgeC55ZWFyID09IG0ueWVhcik7XHJcbiAgICAgICAgICAgIGlmIChobGRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG0uYWRkSG9saWRheXMoaGxkc1swXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIG0uaG9saWRheXMgPSBobGRzLmxlbmd0aCA+IDAgPyBobGRzWzBdIDoge21vbnRoOm0ubW9udGgseWVhcjptLnllYXJ9IGFzIEhvbGlkYXlzO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vIHRoaXMubW9udGgubWFwKChtKT0+e1xyXG5cclxuXHJcbiAgICAgICAgLy8gICAgIGxldCBobGRzID0gdGhpcy5ob2xpZGF5cy5maWx0ZXIoeD0+eC5tb250aD09bS5tb250aCAmJiB4LnllYXIgPT0gbS55ZWFyKTtcclxuICAgICAgICAvLyAgICAgbS5ob2xpZGF5cyA9IGhsZHMubGVuZ3RoID4gMCA/IGhsZHNbMF0gOiB7bW9udGg6bS5tb250aCx5ZWFyOm0ueWVhcn0gYXMgSG9saWRheXM7XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgLy8gdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICB9XHJcbiAgICByZW1vdmVIb2xpZGF5cyhtb250aDogbnVtYmVyLCB5ZWFyOiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaG9saWRheXMpIHtcclxuICAgICAgICAgICAgdGhpcy5ob2xpZGF5cyA9IHRoaXMuaG9saWRheXMuZmlsdGVyKCh4KSA9PiAhKHgueWVhciA9PSB5ZWFyICYmIHgubW9udGggPT0gbW9udGgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaG9saWRheXMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvbkRhdGVTZWxlY3RlZChkYXRlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmRhdGVTZWxlY3RlZC5lbWl0KGRhdGUpO1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGRhdGU7XHJcbiAgICAgICAgdGhpcy5zaG93U2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgb25EYXRlQ2hhbmdlZChkYXRlOiBzdHJpbmcpe1xyXG4gICAgICB0aGlzLmRhdGUgPSBkYXRlO1xyXG4gICAgICAgIHRoaXMuc2hvd1NlbGVjdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHNjcm9sbEV2ZW50KGV2ZSkge1xyXG4gICAgICAgIGlmIChldmUudGFyZ2V0LmNsYXNzTmFtZSA9PSBcIm1vbnRob3V0ZXJcIikge1xyXG4gICAgICAgICAgICAvL2lmICgoZXZlLnRhcmdldC5zY3JvbGxUb3AgKyBldmUudGFyZ2V0Lm9mZnNldEhlaWdodCkgPj0gZXZlLnRhcmdldC5zY3JvbGxIZWlnaHQpIHtcclxuICAgICAgICAgICAgaWYgKChldmUudGFyZ2V0LnNjcm9sbFRvcCArIChldmUudGFyZ2V0Lm9mZnNldEhlaWdodCAqICgzKSkpID49IGV2ZS50YXJnZXQuc2Nyb2xsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyB5b3UncmUgYXQgdGhlIGJvdHRvbSBvZiB0aGUgcGFnZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0TW9udGgoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY1JlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZXZlLnRhcmdldC5zY3JvbGxUb3AgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5wcmV2TW9udGgoKTsgLy8gQ09NTUVOVEVEIFRPIEFWT0lEIFNDUk9MTElORyBPRiBTRUxFQ1RFRCBEQVRFUyBUTyBCT1RUT00gT0YgU0NSRUVOXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNSZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbFN1YnNjcmlwdGlvbikgeyB0aGlzLnNjcm9sbFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGNoYW5nZTogU2ltcGxlQ2hhbmdlID0gY2hhbmdlcy5EYXRlIHx8IG51bGw7XHJcbiAgICAgICAgaWYgKGNoYW5nZSAmJiBjaGFuZ2UucHJldmlvdXNWYWx1ZSkgeyAvLyBpZiB0aGVyZSBpcyBhIHByZXZpb3VzIGNoYW5nZVxyXG4gICAgICAgICAgICBpZiAoY2hhbmdlLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlLnByZXZpb3VzVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMuaW5pdE1vbnRocygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlID0gY2hhbmdlLmN1cnJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmKGNoYW5nZS5jdXJyZW50VmFsdWUhPXVuZGVmaW5lZCAmJiBjaGFuZ2UuY3VycmVudFZhbHVlICE9bnVsbCAmJiBjaGFuZ2UuY3VycmVudFZhbHVlICE9XCJcIil7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnNob3dTZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuIl19