/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, Inject, PLATFORM_ID, NgZone, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
export class WeekComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vlay5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9iaS1kYXRlcGlja2VyLyIsInNvdXJjZXMiOlsibGliL3dlZWsvd2Vlay5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQVcsTUFBTSxlQUFlLENBQUM7QUFJaEksT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFTcEQsTUFBTSxPQUFPLGFBQWE7Ozs7OztJQUV0QixZQUF5QyxRQUFhLEVBQVUsSUFBWSxFQUFVLEdBQXNCO1FBQW5FLGFBQVEsR0FBUixRQUFRLENBQUs7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVUsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFJbkcsaUJBQVksR0FBVyxFQUFFLENBQUE7UUFJeEIsaUJBQVksR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVlsRSx1QkFBa0I7Ozs7O1FBQUcsQ0FBQyxHQUFXLEVBQUUsR0FBUSxFQUFPLEVBQUU7WUFDaEQsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ2xDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLFdBQVcsRUFBRTtvQkFDdkMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNsRDthQUNKO1FBQ0wsQ0FBQyxFQUFBO1FBRUQsd0JBQW1COzs7O1FBQUcsQ0FBQyxHQUFXLEVBQU8sRUFBRTtZQUN2QyxJQUFJO2dCQUNBLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUNsQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxXQUFXLEVB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Ozs7OztJQUFFLDRCQUE4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIFBMQVRGT1JNX0lELCBOZ1pvbmUsIENoYW5nZURldGVjdG9yUmVmLCBWaWV3UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IERheSB9IGZyb20gJy4uL21vZGVscy9kYXknO1xyXG5pbXBvcnQgeyBIb2xpZGF5IH0gZnJvbSAnLi4vbW9kZWxzL2hvbGlkYXknO1xyXG5pbXBvcnQgeyBBbm5vdGF0aW9uIH0gZnJvbSAnLi4vbW9kZWxzL2Fubm90YXRpb24nO1xyXG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2JpLXdlZWsnLFxyXG4gICAgc3R5bGVVcmxzOiBbJ3dlZWsuY29tcG9uZW50LmNzcyddLFxyXG4gICAgdGVtcGxhdGVVcmw6ICd3ZWVrLmNvbXBvbmVudC5odG1sJ1xyXG4gICAgLy90ZW1wbGF0ZTpgPGgxPmRzPC9oMT5gXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBXZWVrQ29tcG9uZW50IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtOiBhbnksIHByaXZhdGUgem9uZTogTmdab25lLCBwcml2YXRlIHJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoKSB3ZWVrOiBEYXlbXTtcclxuICAgIEBJbnB1dCgpIHdlZWtlbmRDbGFzczogc3RyaW5nID0gXCJcIlxyXG4gICAgQElucHV0KCkgdmVydGljYWw6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSBjdXJyZW5jeT86IHN0cmluZztcclxuICAgIEBJbnB1dCgpIGN1cnJlbmN5U3ltYm9sPzogc3RyaW5nO1xyXG4gICAgQE91dHB1dCgpIGRhdGVTZWxlY3RlZDogRXZlbnRFbWl0dGVyPFN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICAvLyBhbm5vdGF0aW9uczpBbm5vdGF0aW9uW107XHJcbiAgICBnZXRGcm9tU2Vzc2lvbihrZXkpIHtcclxuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBrZWVwSW5TZXNzaW9uKGtleSwgdmFsdWUpIHtcclxuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybSkpIHtcclxuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBrZWVwSW5Mb2NhbFN0b3JhZ2UgPSAoa2V5OiBzdHJpbmcsIHZhbDogYW55KTogYW55ID0+IHtcclxuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybSkpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAobG9jYWxTdG9yYWdlKSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWwpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRGcm9tTG9jYWxTdG9yYWdlID0gKGtleTogc3RyaW5nKTogYW55ID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybSkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKGxvY2FsU3RvcmFnZSkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkgPyBrZXkgOiAnJykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnZlcnRDdXJyZW5jeShhbW91bnQ6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IGNvbnZlcnRlZEFtb3VudDogbnVtYmVyID0gYW1vdW50O1xyXG4gICAgICAgIGxldCBjb252ZXJ0RnJvbTogc3RyaW5nID0gdGhpcy5jdXJyZW5jeTtcclxuICAgICAgICBsZXQgY29udmVydFRvOiBzdHJpbmcgPSB0aGlzLmdldEZyb21Mb2NhbFN0b3JhZ2UoXCJjdXJyZW5jeVwiKTtcclxuICAgICAgICBpZiAoY29udmVydEZyb20gJiYgY29udmVydFRvICYmIGNvbnZlcnRGcm9tLnRyaW0oKSAhPSBjb252ZXJ0VG8udHJpbSgpKSB7XHJcbiAgICAgICAgICAgIGxldCBleGNoYW5nZVJhdGVzID0gdGhpcy5nZXRGcm9tU2Vzc2lvbihcImN1cnJlbmN5ZXhjaGFuZ2VyYXRlc1wiKTtcclxuICAgICAgICAgICAgaWYgKGV4Y2hhbmdlUmF0ZXMpIHtcclxuICAgICAgICAgICAgICAgIGxldCBleGNoYW5nZSA9IGV4Y2hhbmdlUmF0ZXMuZmlsdGVyKHggPT4geC5CYXNlQ3VycmVuY3kgPT0gY29udmVydEZyb20udHJpbSgpICYmIHguQ29udmVydGVkQ3VycmVuY3kgPT0gY29udmVydFRvLnRyaW0oKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXhjaGFuZ2UgIT0gdW5kZWZpbmVkICYmIGV4Y2hhbmdlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnZlcnRlZEFtb3VudCA9IE1hdGgucm91bmQoYW1vdW50ICogZXhjaGFuZ2VbMF0uRXhjaGFuZ2VSYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMua2VlcEluTG9jYWxTdG9yYWdlKFwiY3VycmVuY3lzeW1ib2xcIiwgdGhpcy5jdXJyZW5jeVN5bWJvbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5rZWVwSW5Mb2NhbFN0b3JhZ2UoXCJjdXJyZW5jeVwiLCB0aGlzLmN1cnJlbmN5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29udmVydGVkQW1vdW50O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEhvbGlkYXlzKGhsZDogSG9saWRheVtdKSB7XHJcbiAgICAgICAgdGhpcy53ZWVrLmZvckVhY2goKHcpID0+IHtcclxuICAgICAgICAgICAgbGV0IGg6IEhvbGlkYXlbXSA9IGhsZC5maWx0ZXIoKGQpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChkLmRheSkgPT09IHBhcnNlSW50KHcuZGF5KVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAody5pc0N1cnJlbnRNb250aCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGgubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHcuaXNIb2xpZGF5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB3LnRvb2xUaXAgPSBoWzBdLm5hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICB9XHJcbiAgICBhZGRBbm5vdGF0aW9uKGFubjogQW5ub3RhdGlvbltdKSB7XHJcbiAgICAgICAgdGhpcy53ZWVrLmZvckVhY2goKHcpID0+IHtcclxuICAgICAgICAgICAgbGV0IGg6IEFubm90YXRpb25bXSA9IGFubi5maWx0ZXIoKGQpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkLmRheSA9PT0gdy5kYXlcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHcuaXNDdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChoLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB3LmFubm90YXRpb24gPSBoWzBdLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHcuYW5ub3RhdGlvbiAhPSAnJyAmJiB0aGlzLmN1cnJlbmN5ICYmIHRoaXMuY3VycmVuY3lTeW1ib2wpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoYW5nZWRDdXJyZW5jeSA9IHRoaXMuZ2V0RnJvbUxvY2FsU3RvcmFnZSgnY3VycmVuY3lzeW1ib2wnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFtb3VudCA9IHcuYW5ub3RhdGlvbi5zcGxpdChjaGFuZ2VkQ3VycmVuY3kpWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3LmFubm90YXRpb24gPSBjaGFuZ2VkQ3VycmVuY3kgKyB0aGlzLmNvbnZlcnRDdXJyZW5jeShwYXJzZUludChhbW91bnQpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdy5oaWdobGlnaHQgPSBoWzBdLmhpZ2hsaWdodDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmKHRoaXMucmVmICYmICEodGhpcy5yZWYgYXMgVmlld1JlZikuZGVzdHJveSl7XHJcbiAgICAgICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3REYXRlKGU6IEV2ZW50LCBkOiBEYXkpIHtcclxuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBpZiAoZC5pc0FjdGl2ZSAmJiBkLmlzQ3VycmVudE1vbnRoICYmIGQuYW5ub3RhdGlvbiAmJiBkLmFubm90YXRpb24gIT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVNlbGVjdGVkLmVtaXQoKCcwMCcgKyBkLmRheSkuc2xpY2UoLTIpICsgJy0nICsgKCcwMCcgKyBkLm1vbnRoKS5zbGljZSgtMikgKyAnLScgKyBkLnllYXIpO1xyXG4gICAgICAgICAgICAgICAgICAvLyBkLmlzU2VsZWN0ZWQgPSAhZC5pc1NlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFja0J5Rm4oaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gaXRlbS5pZDtcclxuICAgIH1cclxuXHJcbn1cclxuIl19