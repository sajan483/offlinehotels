/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, PLATFORM_ID, Inject, ElementRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, NgZone, ChangeDetectorRef } from '@angular/core';
import * as momentimp from 'moment';
import { MonthComponent } from '../month/month.component';
import { fromEvent } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
/** @type {?} */
const moment = momentimp;
export class CalendarComponent {
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
                this.difference = moment([parseInt(this.Date.split('-')[2]), parseInt(this.Date.split('-')[1]) - 1]).diff(moment([new Date().getFullYear(), new Date().getMonth()]), 'months', true);
            }
            else {
                this.showSelected = false;
                this.date = moment().format('DD-MM-YYYY');
                this.difference = moment([parseInt(this.date.split('-')[2]), parseInt(this.date.split('-')[1]) - 1]).diff(moment([new Date().getFullYear(), new Date().getMonth()]), 'months', true);
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
            this.date = moment().format('DD-MM-YYYY');
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
        let cMonth = moment().set('year', cYear).set('month', parseInt(m) - 1).month() + 1;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmktZGF0ZXBpY2tlci8iLCJzb3VyY2VzIjpbImxpYi9jYWxlbmRhci9jYWxlbmRhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFpQixVQUFVLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLHdCQUF3QixFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBcUQsTUFBTSxlQUFlLENBQUM7QUFDN1IsT0FBTyxLQUFLLFNBQVMsTUFBTSxRQUFRLENBQUM7QUFDcEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBSTFELE9BQU8sRUFBRSxTQUFTLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7TUFDeEMsTUFBTSxHQUFHLFNBQVM7QUFNeEIsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7OztJQXlDMUIsWUFBb0IsQ0FBMkIsRUFBVSxJQUFZLEVBQStCLFFBQWEsRUFDdEcsSUFBdUI7UUFEZCxNQUFDLEdBQUQsQ0FBQyxDQUEwQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQVE7UUFBK0IsYUFBUSxHQUFSLFFBQVEsQ0FBSztRQUN0RyxTQUFJLEdBQUosSUFBSSxDQUFtQjtRQWxDekIsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUs1QixpQkFBWSxHQUFXLEVBQUUsQ0FBQTtRQVN6QixhQUFRLEdBQVksS0FBSyxDQUFDO1FBTTFCLGlCQUFZLEdBQTRCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFcEQsVUFBSyxHQUFnQixFQUFFLENBQUM7UUFLL0Is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Qjs7Ozs7SUFDL0Isd0NBQW1DOzs7OztJQUNuQyxxQ0FBNkI7O0lBRTdCLHlDQUN3RDs7SUFDeEQsaUNBQWE7O0lBQ2IsdUNBQXVCOztJQUN2QiwrQ0FBaUM7O0lBQ2pDLHlDQUE2Qjs7Ozs7SUFFakIsOEJBQW1DOzs7OztJQUFFLGlDQUFvQjs7Ozs7SUFBRSxxQ0FBMEM7O0lBQzdHLGlDQUE4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFZpZXdDaGlsZHJlbiwgUXVlcnlMaXN0LCBQTEFURk9STV9JRCwgSW5qZWN0LCBBZnRlclZpZXdJbml0LCBFbGVtZW50UmVmLCBWaWV3Q2hpbGQsIFZpZXdDb250YWluZXJSZWYsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgTmdab25lLCBDaGFuZ2VEZXRlY3RvclJlZiwgT25EZXN0cm95LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIFNpbXBsZUNoYW5nZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgKiBhcyBtb21lbnRpbXAgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0IHsgTW9udGhDb21wb25lbnQgfSBmcm9tICcuLi9tb250aC9tb250aC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNb250aFllYXIgfSBmcm9tICcuLi9tb2RlbHMvbW9udGh5ZWFyJztcclxuaW1wb3J0IHsgQW5ub3RhdGlvbnMgfSBmcm9tICcuLi9tb2RlbHMvYW5ub3RhdGlvbnMnO1xyXG5pbXBvcnQgeyBIb2xpZGF5cyB9IGZyb20gJy4uL21vZGVscy9ob2xpZGF5cyc7XHJcbmltcG9ydCB7IGZyb21FdmVudCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5jb25zdCBtb21lbnQgPSBtb21lbnRpbXA7XHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdiaS1jYWxlbmRhcicsXHJcbiAgICBzdHlsZVVybHM6IFsnY2FsZW5kYXIuY29tcG9uZW50LmNzcyddLFxyXG4gICAgdGVtcGxhdGVVcmw6ICdjYWxlbmRhci5jb21wb25lbnQuaHRtbCdcclxufSlcclxuZXhwb3J0IGNsYXNzIENhbGVuZGFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XHJcblxyXG5cclxuICAgIEBWaWV3Q2hpbGRyZW4oTW9udGhDb21wb25lbnQpXHJcbiAgICBjbXBNb250aHM6IFF1ZXJ5TGlzdDxNb250aENvbXBvbmVudD47XHJcbiAgICBAVmlld0NoaWxkKCdtb250aHMnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYsIHN0YXRpYzogZmFsc2UgfSkgcHJpdmF0ZSBzbGlkZXI6IFZpZXdDb250YWluZXJSZWY7XHJcbiAgICBAVmlld0NoaWxkKCd5ZWFyJywgeyBzdGF0aWM6IGZhbHNlIH0pIHByaXZhdGUgbW9udGhQYXJlbnQ6IEVsZW1lbnRSZWY7XHJcblxyXG4gICAgQElucHV0KCkgbW9udGhzOiBudW1iZXIgPSAxO1xyXG5cclxuICAgIEBJbnB1dCgpIERhdGU6IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgd2Vla2VuZENsYXNzOiBzdHJpbmcgPSBcIlwiXHJcblxyXG4gICAgQElucHV0KClcclxuICAgIG1pbkRhdGU6IG51bWJlcjtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgbWF4RGF0ZTogbnVtYmVyO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICB2ZXJ0aWNhbDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIEBJbnB1dCgpIGN1cnJlbmN5Pzogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgY3VycmVuY3lTeW1ib2w/OiBzdHJpbmc7XHJcblxyXG4gICAgQE91dHB1dCgpXHJcbiAgICBtb250aENoYW5nZWQ6IEV2ZW50RW1pdHRlcjxNb250aFllYXI+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIHB1YmxpYyBtb250aDogTW9udGhZZWFyW10gPSBbXTtcclxuICAgIHByaXZhdGUgYW5ub3RhdGlvbnM6IEFubm90YXRpb25zW107XHJcbiAgICBwcml2YXRlIGhvbGlkYXlzOiBIb2xpZGF5c1tdO1xyXG5cclxuICAgIEBPdXRwdXQoKVxyXG4gICAgZGF0ZVNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8U3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIGRhdGU6IHN0cmluZztcclxuICAgIGRpZmZlcmVuY2U6IG51bWJlciA9IDA7XHJcbiAgICBzY3JvbGxTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuICAgIHNob3dTZWxlY3RlZDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIHByaXZhdGUgem9uZTogTmdab25lLCBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtOiBhbnksXHJcbiAgICAgICAgcHVibGljIGNSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7IH1cclxuXHJcbiAgICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm0pKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZlcnRpY2FsID09IHRydWUpIHsgdGhpcy5tb250aFBhcmVudC5uYXRpdmVFbGVtZW50LnNjcm9sbCgwLCB0aGlzLnNsaWRlci5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nLmNsaWVudEhlaWdodCAqIHRoaXMuZGlmZmVyZW5jZSwgeyBiZWhhdmlvcjogJ3Ntb290aCcgfSk7IH1cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5kaWZmZXJlbmNlLCBcInRoaXMuZGlmZmVyZW5jZVwiKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHRoaXMuYW5ub3RhdGlvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLmhvbGlkYXlzID0gW107XHJcbiAgICAgICAgdGhpcy5pbml0TW9udGhzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMudmVydGljYWwgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgaWYodGhpcy5EYXRlIT11bmRlZmluZWQgJiYgdGhpcy5EYXRlLmxlbmd0aD4wICYmIHRoaXMuZGF0ZSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5kYXRlID0gdGhpcy5EYXRlO1xyXG4gICAgICAgICAgICB0aGlzLmRpZmZlcmVuY2UgPSBtb21lbnQoW3BhcnNlSW50KHRoaXMuRGF0ZS5zcGxpdCgnLScpWzJdKSwgcGFyc2VJbnQodGhpcy5EYXRlLnNwbGl0KCctJylbMV0pIC0gMV0pLmRpZmYobW9tZW50KFtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksIG5ldyBEYXRlKCkuZ2V0TW9udGgoKV0pLCAnbW9udGhzJywgdHJ1ZSk7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5zaG93U2VsZWN0ZWQgID1mYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5kYXRlID0gbW9tZW50KCkuZm9ybWF0KCdERC1NTS1ZWVlZJyk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlmZmVyZW5jZSA9IG1vbWVudChbcGFyc2VJbnQodGhpcy5kYXRlLnNwbGl0KCctJylbMl0pLCBwYXJzZUludCh0aGlzLmRhdGUuc3BsaXQoJy0nKVsxXSkgLSAxXSkuZGlmZihtb21lbnQoW25ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSwgbmV3IERhdGUoKS5nZXRNb250aCgpXSksICdtb250aHMnLCB0cnVlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kaWZmZXJlbmNlID0gTWF0aC5mbG9vcih0aGlzLmRpZmZlcmVuY2UpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kaWZmZXJlbmNlID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmRpZmZlcmVuY2U7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXZNb250aCh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL3RoaXMubW9udGggPSBBcnJheVt0aGlzLm1vbnRoc10uZmlsbCgoeCxpKT0+Y01vbnRoKyspO1xyXG4gICAgICAgIC8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLnNjcm9sbEV2ZW50LmJpbmQodGhpcyksIHRydWUpO1xyXG4gICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtKSkge1xyXG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxTdWJzY3JpcHRpb24gPSBmcm9tRXZlbnQod2luZG93LCAnc2Nyb2xsJywgeyBwYXNzaXZlOiB0cnVlLCBjYXB0dXJlOiB0cnVlIH0pLnBpcGUoZGVib3VuY2VUaW1lKDUwMCkpLnN1YnNjcmliZShlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbEV2ZW50KGUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHRyYWNrQnlGbihpbmRleCwgaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBpdGVtLmlkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdE1vbnRocygpIHtcclxuICAgICAgdGhpcy5tb250aCA9IFtdO1xyXG4gICAgICB0aGlzLmRhdGUgPSB0aGlzLkRhdGU7XHJcbiAgICAgIGlmICh0eXBlb2YgKHRoaXMuRGF0ZSkgPT0gXCJ1bmRlZmluZWRcIiB8fCB0aGlzLkRhdGUubGVuZ3RoID09IDApIHtcclxuICAgICAgICB0aGlzLmRhdGUgPSBtb21lbnQoKS5mb3JtYXQoJ0RELU1NLVlZWVknKTtcclxuICAgICAgICB0aGlzLnNob3dTZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICB0aGlzLnNob3dTZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IG0gPSB0aGlzLmRhdGUuc3BsaXQoJy0nKVsxXTtcclxuICAgICAgICBsZXQgeSA9IHRoaXMuZGF0ZS5zcGxpdCgnLScpWzJdO1xyXG4gICAgICAgIGxldCBjWWVhcjogbnVtYmVyID0gcGFyc2VJbnQoeSk7XHJcbiAgICAgICAgbGV0IGNNb250aCA9IG1vbWVudCgpLnNldCgneWVhcicsIGNZZWFyKS5zZXQoJ21vbnRoJywgcGFyc2VJbnQobSkgLSAxKS5tb250aCgpICsgMTsgLy9wYXJzZUludCggbW9tZW50KCkuZm9ybWF0KCdNJykpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tb250aHM7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLm1vbnRoLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQ6IGNZZWFyICsgJycgKyBjTW9udGgsXHJcbiAgICAgICAgICAgICAgICB5ZWFyOiBjWWVhcixcclxuICAgICAgICAgICAgICAgIG1vbnRoOiBjTW9udGhcclxuICAgICAgICAgICAgfSBhcyBNb250aFllYXIpO1xyXG4gICAgICAgICAgICB0aGlzLm1vbnRoQ2hhbmdlZC5lbWl0KHtcclxuICAgICAgICAgICAgICAgIHllYXI6IGNZZWFyLFxyXG4gICAgICAgICAgICAgICAgbW9udGg6IGNNb250aCxcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudDogdGhpc1xyXG4gICAgICAgICAgICB9IGFzIE1vbnRoWWVhcik7XHJcbiAgICAgICAgICAgIGNNb250aCsrO1xyXG4gICAgICAgICAgICBpZiAoY01vbnRoID4gMTIpIHtcclxuICAgICAgICAgICAgICAgIGNNb250aCA9IDE7XHJcbiAgICAgICAgICAgICAgICBjWWVhcisrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByZXZNb250aChzdGF0dXM/KSB7XHJcbiAgICAgICAgbGV0IGZpcnN0TW9udGg6IE1vbnRoWWVhciA9IHRoaXMubW9udGhbMF07XHJcbiAgICAgICAgbGV0IG5ld01vbnRoOiBNb250aFllYXIgPSB7IGNvbXBvbmVudDogdGhpcyB9IGFzIE1vbnRoWWVhcjtcclxuXHJcbiAgICAgICAgaWYgKGZpcnN0TW9udGgubW9udGggPT09IG5ldyBEYXRlKCkuZ2V0VVRDTW9udGgoKSArIDEgJiYgZmlyc3RNb250aC55ZWFyID09PSBuZXcgRGF0ZSgpLmdldFVUQ0Z1bGxZZWFyKCkpIHsgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZmlyc3RNb250aC5tb250aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgbmV3TW9udGgubW9udGggPSAxMjtcclxuICAgICAgICAgICAgICAgIG5ld01vbnRoLnllYXIgPSBmaXJzdE1vbnRoLnllYXIgLSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV3TW9udGgubW9udGggPSBmaXJzdE1vbnRoLm1vbnRoIC0gMTtcclxuICAgICAgICAgICAgICAgIG5ld01vbnRoLnllYXIgPSBmaXJzdE1vbnRoLnllYXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmV3TW9udGguaWQgPSBuZXdNb250aC55ZWFyLnRvU3RyaW5nKCkgKyBuZXdNb250aC5tb250aC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9udGgudW5zaGlmdChuZXdNb250aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vbnRoLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb250aC51bnNoaWZ0KG5ld01vbnRoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY1JlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vbnRoQ2hhbmdlZC5lbWl0KG5ld01vbnRoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBuZXh0TW9udGgoKSB7XHJcbiAgICAgICAgbGV0IGxhc3RNb250aDogTW9udGhZZWFyID0gdGhpcy5tb250aFt0aGlzLm1vbnRoLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGxldCBuZXdNb250aDogTW9udGhZZWFyID0geyBjb21wb25lbnQ6IHRoaXMgfSBhcyBNb250aFllYXI7XHJcbiAgICAgICAgbGV0IG1vbnRoID0gMTIgLSBuZXcgRGF0ZSgpLmdldFVUQ01vbnRoKCkgKyAxXHJcbiAgICAgICAgaWYgKChtb250aCA9PT0gMTEgJiYgbGFzdE1vbnRoLm1vbnRoID09PSAxMiAmJiB0aGlzLm1vbnRoICYmIHRoaXMubW9udGgubGVuZ3RoID4gMTIpIHx8IChsYXN0TW9udGgubW9udGggPj0gbmV3IERhdGUoKS5nZXRVVENNb250aCgpICsgMSAmJiBsYXN0TW9udGgueWVhciA9PSBuZXcgRGF0ZSgpLmdldFVUQ0Z1bGxZZWFyKCkgKyAxKSkgeyB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChsYXN0TW9udGgubW9udGggPiAxMSkge1xyXG4gICAgICAgICAgICAgICAgbmV3TW9udGgubW9udGggPSAxO1xyXG4gICAgICAgICAgICAgICAgbmV3TW9udGgueWVhciA9IGxhc3RNb250aC55ZWFyICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5ld01vbnRoLm1vbnRoID0gbGFzdE1vbnRoLm1vbnRoICsgMTtcclxuICAgICAgICAgICAgICAgIG5ld01vbnRoLnllYXIgPSBsYXN0TW9udGgueWVhcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmVydGljYWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9udGguc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXdNb250aFsnaWQnXSA9IG5ld01vbnRoLnllYXIgKyAnJyArIG5ld01vbnRoLm1vbnRoO1xyXG4gICAgICAgICAgICB0aGlzLm1vbnRoLnB1c2gobmV3TW9udGgpO1xyXG4gICAgICAgICAgICB0aGlzLmNSZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICAgICAgICB0aGlzLm1vbnRoQ2hhbmdlZC5lbWl0KG5ld01vbnRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQW5ub3RhdGlvbnMoYW5ub3RhdGlvbjogQW5ub3RhdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdGhpcy5yZW1vdmVBbm5vdGF0aW9ucyhhbm5vdGF0aW9uLm1vbnRoLCBhbm5vdGF0aW9uLnllYXIpO1xyXG4gICAgICAgIHRoaXMuYW5ub3RhdGlvbnMgPSBbXHJcbiAgICAgICAgICAgIC4uLnRoaXMuYW5ub3RhdGlvbnMsXHJcbiAgICAgICAgICAgIGFubm90YXRpb25cclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMuY21wTW9udGhzLm1hcCgobSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaGxkcyA9IHRoaXMuYW5ub3RhdGlvbnMuZmlsdGVyKHggPT4geC5tb250aCA9PSBtLm1vbnRoICYmIHgueWVhciA9PSBtLnllYXIpO1xyXG4gICAgICAgICAgICBpZiAoaGxkcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBtLmFkZEFubm90YXRpb25zKGhsZHNbMF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICBtLmhvbGlkYXlzID0gaGxkcy5sZW5ndGggPiAwID8gaGxkc1swXSA6IHttb250aDptLm1vbnRoLHllYXI6bS55ZWFyfSBhcyBIb2xpZGF5cztcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMubW9udGgubWFwKChtKT0+e1xyXG5cclxuXHJcbiAgICAgICAgLy8gICAgIGxldCBhbm4gPSB0aGlzLmFubm90YXRpb25zLmZpbHRlcih4PT54Lm1vbnRoPT1tLm1vbnRoICYmIHgueWVhciA9PSBtLnllYXIpO1xyXG4gICAgICAgIC8vICAgICBtLmFubm90YXRpb24gPSBhbm4ubGVuZ3RoID4gMCA/IGFublswXSA6IHttb250aDptLm1vbnRoLHllYXI6bS55ZWFyfSBhcyBBbm5vdGF0aW9ucztcclxuICAgICAgICAvLyB9KTtcclxuICAgIH1cclxuICAgIHJlbW92ZUFubm90YXRpb25zKG1vbnRoOiBudW1iZXIsIHllYXI6IG51bWJlcikge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hbm5vdGF0aW9ucykge1xyXG4gICAgICAgICAgICB0aGlzLmFubm90YXRpb25zID0gdGhpcy5hbm5vdGF0aW9ucy5maWx0ZXIoKHgpID0+ICEoeC55ZWFyID09IHllYXIgJiYgeC5tb250aCA9PSBtb250aCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hbm5vdGF0aW9ucyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFkZEhvbGlkYXlzKGhvbGlkYXlzOiBIb2xpZGF5cykge1xyXG5cclxuICAgICAgICB0aGlzLnJlbW92ZUhvbGlkYXlzKGhvbGlkYXlzLm1vbnRoLCBob2xpZGF5cy55ZWFyKTtcclxuXHJcbiAgICAgICAgdGhpcy5ob2xpZGF5cyA9IFtcclxuICAgICAgICAgICAgLi4udGhpcy5ob2xpZGF5cyxcclxuICAgICAgICAgICAgaG9saWRheXNcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB0aGlzLmNtcE1vbnRocy5tYXAoKG0pID0+IHtcclxuICAgICAgICAgICAgbGV0IGhsZHMgPSB0aGlzLmhvbGlkYXlzLmZpbHRlcih4ID0+IHgubW9udGggPT0gbS5tb250aCAmJiB4LnllYXIgPT0gbS55ZWFyKTtcclxuICAgICAgICAgICAgaWYgKGhsZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbS5hZGRIb2xpZGF5cyhobGRzWzBdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgbS5ob2xpZGF5cyA9IGhsZHMubGVuZ3RoID4gMCA/IGhsZHNbMF0gOiB7bW9udGg6bS5tb250aCx5ZWFyOm0ueWVhcn0gYXMgSG9saWRheXM7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gdGhpcy5tb250aC5tYXAoKG0pPT57XHJcblxyXG5cclxuICAgICAgICAvLyAgICAgbGV0IGhsZHMgPSB0aGlzLmhvbGlkYXlzLmZpbHRlcih4PT54Lm1vbnRoPT1tLm1vbnRoICYmIHgueWVhciA9PSBtLnllYXIpO1xyXG4gICAgICAgIC8vICAgICBtLmhvbGlkYXlzID0gaGxkcy5sZW5ndGggPiAwID8gaGxkc1swXSA6IHttb250aDptLm1vbnRoLHllYXI6bS55ZWFyfSBhcyBIb2xpZGF5cztcclxuICAgICAgICAvLyB9KTtcclxuICAgICAgICAvLyB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcclxuICAgIH1cclxuICAgIHJlbW92ZUhvbGlkYXlzKG1vbnRoOiBudW1iZXIsIHllYXI6IG51bWJlcikge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5ob2xpZGF5cykge1xyXG4gICAgICAgICAgICB0aGlzLmhvbGlkYXlzID0gdGhpcy5ob2xpZGF5cy5maWx0ZXIoKHgpID0+ICEoeC55ZWFyID09IHllYXIgJiYgeC5tb250aCA9PSBtb250aCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5ob2xpZGF5cyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uRGF0ZVNlbGVjdGVkKGRhdGU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZGF0ZVNlbGVjdGVkLmVtaXQoZGF0ZSk7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gZGF0ZTtcclxuICAgICAgICB0aGlzLnNob3dTZWxlY3RlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBvbkRhdGVDaGFuZ2VkKGRhdGU6IHN0cmluZyl7XHJcbiAgICAgIHRoaXMuZGF0ZSA9IGRhdGU7XHJcbiAgICAgICAgdGhpcy5zaG93U2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgc2Nyb2xsRXZlbnQoZXZlKSB7XHJcbiAgICAgICAgaWYgKGV2ZS50YXJnZXQuY2xhc3NOYW1lID09IFwibW9udGhvdXRlclwiKSB7XHJcbiAgICAgICAgICAgIC8vaWYgKChldmUudGFyZ2V0LnNjcm9sbFRvcCArIGV2ZS50YXJnZXQub2Zmc2V0SGVpZ2h0KSA+PSBldmUudGFyZ2V0LnNjcm9sbEhlaWdodCkge1xyXG4gICAgICAgICAgICBpZiAoKGV2ZS50YXJnZXQuc2Nyb2xsVG9wICsgKGV2ZS50YXJnZXQub2Zmc2V0SGVpZ2h0ICogKDMpKSkgPj0gZXZlLnRhcmdldC5zY3JvbGxIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIC8vIHlvdSdyZSBhdCB0aGUgYm90dG9tIG9mIHRoZSBwYWdlXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRNb250aCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jUmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChldmUudGFyZ2V0LnNjcm9sbFRvcCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLnByZXZNb250aCgpOyAvLyBDT01NRU5URUQgVE8gQVZPSUQgU0NST0xMSU5HIE9GIFNFTEVDVEVEIERBVEVTIFRPIEJPVFRPTSBPRiBTQ1JFRU5cclxuICAgICAgICAgICAgICAgIHRoaXMuY1JlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsU3Vic2NyaXB0aW9uKSB7IHRoaXMuc2Nyb2xsU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCkgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgY2hhbmdlOiBTaW1wbGVDaGFuZ2UgPSBjaGFuZ2VzLkRhdGUgfHwgbnVsbDtcclxuICAgICAgICBpZiAoY2hhbmdlICYmIGNoYW5nZS5wcmV2aW91c1ZhbHVlKSB7IC8vIGlmIHRoZXJlIGlzIGEgcHJldmlvdXMgY2hhbmdlXHJcbiAgICAgICAgICAgIGlmIChjaGFuZ2UuY3VycmVudFZhbHVlICE9PSBjaGFuZ2UucHJldmlvdXNWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5pbml0TW9udGhzKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGUgPSBjaGFuZ2UuY3VycmVudFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYoY2hhbmdlLmN1cnJlbnRWYWx1ZSE9dW5kZWZpbmVkICYmIGNoYW5nZS5jdXJyZW50VmFsdWUgIT1udWxsICYmIGNoYW5nZS5jdXJyZW50VmFsdWUgIT1cIlwiKXtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5zaG93U2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4iXX0=