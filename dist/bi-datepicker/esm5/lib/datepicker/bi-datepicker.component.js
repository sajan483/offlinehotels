/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
var BiDatepickerComponent = /** @class */ (function () {
    function BiDatepickerComponent() {
        this.isOpen = false;
        this.weekendClass = "";
        this.monthChanged = new EventEmitter();
        this.open = new EventEmitter();
        this.dateSelected = new EventEmitter();
    }
    /**
     * @return {?}
     */
    BiDatepickerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @return {?}
     */
    BiDatepickerComponent.prototype.toggleCalendar = /**
     * @return {?}
     */
    function () {
        this.isOpen = !this.isOpen;
        this.open.emit(this.isOpen);
    };
    /**
     * @return {?}
     */
    BiDatepickerComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @param {?} my
     * @return {?}
     */
    BiDatepickerComponent.prototype.onMonthChanged = /**
     * @param {?} my
     * @return {?}
     */
    function (my) {
        this.monthChanged.emit({ month: my.month, year: my.year });
    };
    /**
     * @param {?} annotation
     * @return {?}
     */
    BiDatepickerComponent.prototype.addAnnotations = /**
     * @param {?} annotation
     * @return {?}
     */
    function (annotation) {
        this.calendar.addAnnotations(annotation);
    };
    /**
     * @param {?} holidays
     * @return {?}
     */
    BiDatepickerComponent.prototype.addHolidays = /**
     * @param {?} holidays
     * @return {?}
     */
    function (holidays) {
        this.calendar.addHolidays(holidays);
    };
    /**
     * @param {?} date
     * @return {?}
     */
    BiDatepickerComponent.prototype.onDateSelected = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        this.dateSelected.emit(date);
    };
    BiDatepickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bi-datepicker',
                    template: "<div fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\r\n    <input matInput id=\"dtPicker\" fxFlex (focus)=\"toggleCalendar()\"/> <span><mat-icon (click)=\"toggleCalendar()\" >date_range</mat-icon></span>    \r\n</div>\r\n\r\n<ng-container *ngIf=\"isOpen\" >\r\n    <bi-calendar [vertical]=\"vertical\" [Date]=\"Date\"  [months]=\"months\" [minDate]=\"minDate\" [maxDate]=\"maxDate\" (monthChanged)=\"onMonthChanged($event)\" (dateSelected)=\"onDateSelected($event)\" ></bi-calendar>\r\n</ng-container>"
                }] }
    ];
    /** @nocollapse */
    BiDatepickerComponent.ctorParameters = function () { return []; };
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
    return BiDatepickerComponent;
}());
export { BiDatepickerComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmktZGF0ZXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9iaS1kYXRlcGlja2VyLyIsInNvdXJjZXMiOlsibGliL2RhdGVwaWNrZXIvYmktZGF0ZXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLFNBQVMsRUFBaUIsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6RyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQU1uRTtJQVlFO1FBUUEsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUd4QixpQkFBWSxHQUFXLEVBQUUsQ0FBQTtRQU16QixpQkFBWSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBR3JELFNBQUksR0FBMEIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUdqRCxpQkFBWSxHQUF5QixJQUFJLFlBQVksRUFBRSxDQUFDO0lBdkJ4QyxDQUFDOzs7O0lBOEJqQix3Q0FBUTs7O0lBQVI7SUFFQSxDQUFDOzs7O0lBRUQsOENBQWM7OztJQUFkO1FBQ0UsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7Ozs7SUFDRCwrQ0FBZTs7O0lBQWY7SUFFQSxDQUFDOzs7OztJQUVELDhDQUFjOzs7O0lBQWQsVUFBZSxFQUFhO1FBQzFCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRzdELENBQUM7Ozs7O0lBQ00sOENBQWM7Ozs7SUFBckIsVUFBc0IsVUFBdUI7UUFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0MsQ0FBQzs7Ozs7SUFDTSwyQ0FBVzs7OztJQUFsQixVQUFtQixRQUFrQjtRQUNuQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDOzs7OztJQUNELDhDQUFjOzs7O0lBQWQsVUFBZSxJQUFZO1FBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRS9CLENBQUM7O2dCQXBFRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLDJnQkFBMkM7aUJBRTVDOzs7OzsyQkFJRSxTQUFTLFNBQUMsaUJBQWlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO3lCQU05QyxLQUFLO3VCQUdMLEtBQUs7K0JBS0wsS0FBSzsyQkFHTCxLQUFLOytCQUdMLE1BQU07dUJBR04sTUFBTTsrQkFHTixNQUFNOzBCQUdOLEtBQUs7MEJBRUwsS0FBSzs7SUE4QlIsNEJBQUM7Q0FBQSxBQXJFRCxJQXFFQztTQWhFWSxxQkFBcUI7OztJQUdoQyx5Q0FDNEI7O0lBSzVCLHVDQUNlOztJQUVmLHFDQUNhOztJQUViLHVDQUF3Qjs7SUFFeEIsNkNBQ3lCOztJQUV6Qix5Q0FDa0I7O0lBRWxCLDZDQUNxRDs7SUFFckQscUNBQ2lEOztJQUVqRCw2Q0FDd0Q7O0lBRXhELHdDQUNnQjs7SUFDaEIsd0NBQ2dCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBWaWV3Q2hpbGQsIEFmdGVyVmlld0luaXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENhbGVuZGFyQ29tcG9uZW50IH0gZnJvbSAnLi4vY2FsZW5kYXIvY2FsZW5kYXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTW9udGhZZWFyIH0gZnJvbSAnLi4vbW9kZWxzL21vbnRoeWVhcic7XHJcbmltcG9ydCB7IEFubm90YXRpb25zIH0gZnJvbSAnLi4vbW9kZWxzL2Fubm90YXRpb25zJztcclxuaW1wb3J0IHsgSG9saWRheXMgfSBmcm9tICcuLi9tb2RlbHMvaG9saWRheXMnO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYmktZGF0ZXBpY2tlcicsXHJcbiAgdGVtcGxhdGVVcmw6ICdiaS1kYXRlcGlja2VyLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZXM6IFtdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBCaURhdGVwaWNrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xyXG5cclxuXHJcbiAgQFZpZXdDaGlsZChDYWxlbmRhckNvbXBvbmVudCwgeyBzdGF0aWM6IGZhbHNlIH0pXHJcbiAgY2FsZW5kYXI6IENhbGVuZGFyQ29tcG9uZW50O1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7IH1cclxuXHJcbiAgQElucHV0KClcclxuICBtb250aHM6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KClcclxuICBEYXRlOiBTdHJpbmc7XHJcblxyXG4gIGlzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHdlZWtlbmRDbGFzczogc3RyaW5nID0gXCJcIlxyXG5cclxuICBASW5wdXQoKVxyXG4gIHZlcnRpY2FsOiBib29sZWFuO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBtb250aENoYW5nZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBvcGVuOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGRhdGVTZWxlY3RlZDogRXZlbnRFbWl0dGVyPFN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbWluRGF0ZTogbnVtYmVyO1xyXG4gIEBJbnB1dCgpXHJcbiAgbWF4RGF0ZTogbnVtYmVyO1xyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuXHJcbiAgfVxyXG5cclxuICB0b2dnbGVDYWxlbmRhcigpIHtcclxuICAgIHRoaXMuaXNPcGVuID0gIXRoaXMuaXNPcGVuO1xyXG4gICAgdGhpcy5vcGVuLmVtaXQodGhpcy5pc09wZW4pO1xyXG4gIH1cclxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcblxyXG4gIH1cclxuXHJcbiAgb25Nb250aENoYW5nZWQobXk6IE1vbnRoWWVhcikge1xyXG4gICAgdGhpcy5tb250aENoYW5nZWQuZW1pdCh7IG1vbnRoOiBteS5tb250aCwgeWVhcjogbXkueWVhciB9KTtcclxuXHJcblxyXG4gIH1cclxuICBwdWJsaWMgYWRkQW5ub3RhdGlvbnMoYW5ub3RhdGlvbjogQW5ub3RhdGlvbnMpIHtcclxuICAgIHRoaXMuY2FsZW5kYXIuYWRkQW5ub3RhdGlvbnMoYW5ub3RhdGlvbik7XHJcbiAgfVxyXG4gIHB1YmxpYyBhZGRIb2xpZGF5cyhob2xpZGF5czogSG9saWRheXMpIHtcclxuICAgIHRoaXMuY2FsZW5kYXIuYWRkSG9saWRheXMoaG9saWRheXMpO1xyXG4gIH1cclxuICBvbkRhdGVTZWxlY3RlZChkYXRlOiBTdHJpbmcpIHtcclxuICAgIHRoaXMuZGF0ZVNlbGVjdGVkLmVtaXQoZGF0ZSk7XHJcblxyXG4gIH1cclxufVxyXG4iXX0=