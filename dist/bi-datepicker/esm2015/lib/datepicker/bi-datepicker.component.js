/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
export class BiDatepickerComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmktZGF0ZXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9iaS1kYXRlcGlja2VyLyIsInNvdXJjZXMiOlsibGliL2RhdGVwaWNrZXIvYmktZGF0ZXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLFNBQVMsRUFBaUIsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6RyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQVduRSxNQUFNLE9BQU8scUJBQXFCO0lBT2hDO1FBUUEsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUd4QixpQkFBWSxHQUFXLEVBQUUsQ0FBQTtRQU16QixpQkFBWSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBR3JELFNBQUksR0FBMEIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUdqRCxpQkFBWSxHQUF5QixJQUFJLFlBQVksRUFBRSxDQUFDO0lBdkJ4QyxDQUFDOzs7O0lBOEJqQixRQUFRO0lBRVIsQ0FBQzs7OztJQUVELGNBQWM7UUFDWixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUIsQ0FBQzs7OztJQUNELGVBQWU7SUFFZixDQUFDOzs7OztJQUVELGNBQWMsQ0FBQyxFQUFhO1FBQzFCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRzdELENBQUM7Ozs7O0lBQ00sY0FBYyxDQUFDLFVBQXVCO1FBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7Ozs7O0lBQ00sV0FBVyxDQUFDLFFBQWtCO1FBQ25DLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Ozs7O0lBQ0QsY0FBYyxDQUFDLElBQVk7UUFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFL0IsQ0FBQzs7O1lBcEVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsMmdCQUEyQzthQUU1Qzs7Ozs7dUJBSUUsU0FBUyxTQUFDLGlCQUFpQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtxQkFNOUMsS0FBSzttQkFHTCxLQUFLOzJCQUtMLEtBQUs7dUJBR0wsS0FBSzsyQkFHTCxNQUFNO21CQUdOLE1BQU07MkJBR04sTUFBTTtzQkFHTixLQUFLO3NCQUVMLEtBQUs7Ozs7SUEvQk4seUNBQzRCOztJQUs1Qix1Q0FDZTs7SUFFZixxQ0FDYTs7SUFFYix1Q0FBd0I7O0lBRXhCLDZDQUN5Qjs7SUFFekIseUNBQ2tCOztJQUVsQiw2Q0FDcUQ7O0lBRXJELHFDQUNpRDs7SUFFakQsNkNBQ3dEOztJQUV4RCx3Q0FDZ0I7O0lBQ2hCLHdDQUNnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgVmlld0NoaWxkLCBBZnRlclZpZXdJbml0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDYWxlbmRhckNvbXBvbmVudCB9IGZyb20gJy4uL2NhbGVuZGFyL2NhbGVuZGFyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE1vbnRoWWVhciB9IGZyb20gJy4uL21vZGVscy9tb250aHllYXInO1xyXG5pbXBvcnQgeyBBbm5vdGF0aW9ucyB9IGZyb20gJy4uL21vZGVscy9hbm5vdGF0aW9ucyc7XHJcbmltcG9ydCB7IEhvbGlkYXlzIH0gZnJvbSAnLi4vbW9kZWxzL2hvbGlkYXlzJztcclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2JpLWRhdGVwaWNrZXInLFxyXG4gIHRlbXBsYXRlVXJsOiAnYmktZGF0ZXBpY2tlci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVzOiBbXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQmlEYXRlcGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcclxuXHJcblxyXG4gIEBWaWV3Q2hpbGQoQ2FsZW5kYXJDb21wb25lbnQsIHsgc3RhdGljOiBmYWxzZSB9KVxyXG4gIGNhbGVuZGFyOiBDYWxlbmRhckNvbXBvbmVudDtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbW9udGhzOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgRGF0ZTogU3RyaW5nO1xyXG5cclxuICBpc09wZW46IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KClcclxuICB3ZWVrZW5kQ2xhc3M6IHN0cmluZyA9IFwiXCJcclxuXHJcbiAgQElucHV0KClcclxuICB2ZXJ0aWNhbDogYm9vbGVhbjtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgbW9udGhDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgb3BlbjogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBkYXRlU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxTdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG1pbkRhdGU6IG51bWJlcjtcclxuICBASW5wdXQoKVxyXG4gIG1heERhdGU6IG51bWJlcjtcclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcblxyXG4gIH1cclxuXHJcbiAgdG9nZ2xlQ2FsZW5kYXIoKSB7XHJcbiAgICB0aGlzLmlzT3BlbiA9ICF0aGlzLmlzT3BlbjtcclxuICAgIHRoaXMub3Blbi5lbWl0KHRoaXMuaXNPcGVuKTtcclxuICB9XHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG5cclxuICB9XHJcblxyXG4gIG9uTW9udGhDaGFuZ2VkKG15OiBNb250aFllYXIpIHtcclxuICAgIHRoaXMubW9udGhDaGFuZ2VkLmVtaXQoeyBtb250aDogbXkubW9udGgsIHllYXI6IG15LnllYXIgfSk7XHJcblxyXG5cclxuICB9XHJcbiAgcHVibGljIGFkZEFubm90YXRpb25zKGFubm90YXRpb246IEFubm90YXRpb25zKSB7XHJcbiAgICB0aGlzLmNhbGVuZGFyLmFkZEFubm90YXRpb25zKGFubm90YXRpb24pO1xyXG4gIH1cclxuICBwdWJsaWMgYWRkSG9saWRheXMoaG9saWRheXM6IEhvbGlkYXlzKSB7XHJcbiAgICB0aGlzLmNhbGVuZGFyLmFkZEhvbGlkYXlzKGhvbGlkYXlzKTtcclxuICB9XHJcbiAgb25EYXRlU2VsZWN0ZWQoZGF0ZTogU3RyaW5nKSB7XHJcbiAgICB0aGlzLmRhdGVTZWxlY3RlZC5lbWl0KGRhdGUpO1xyXG5cclxuICB9XHJcbn1cclxuIl19