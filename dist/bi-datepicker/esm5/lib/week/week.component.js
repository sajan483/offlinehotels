/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, Inject, PLATFORM_ID, NgZone, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
var WeekComponent = /** @class */ (function () {
    function WeekComponent(platform, zone, ref) {
        var _this = this;
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
        function (key, val) {
            if (isPlatformBrowser(_this.platform)) {
                if (typeof (localStorage) !== "undefined") {
                    localStorage.setItem(key, JSON.stringify(val));
                }
            }
        });
        this.getFromLocalStorage = (/**
         * @param {?} key
         * @return {?}
         */
        function (key) {
            try {
                if (isPlatformBrowser(_this.platform)) {
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
    // annotations:Annotation[];
    /**
     * @param {?} key
     * @return {?}
     */
    WeekComponent.prototype.getFromSession = 
    // annotations:Annotation[];
    /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        if (isPlatformBrowser(this.platform)) {
            return JSON.parse(sessionStorage.getItem(key));
        }
    };
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    WeekComponent.prototype.keepInSession = /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        if (isPlatformBrowser(this.platform)) {
            sessionStorage.setItem(key, value);
        }
    };
    /**
     * @param {?} amount
     * @return {?}
     */
    WeekComponent.prototype.convertCurrency = /**
     * @param {?} amount
     * @return {?}
     */
    function (amount) {
        /** @type {?} */
        var convertedAmount = amount;
        /** @type {?} */
        var convertFrom = this.currency;
        /** @type {?} */
        var convertTo = this.getFromLocalStorage("currency");
        if (convertFrom && convertTo && convertFrom.trim() != convertTo.trim()) {
            /** @type {?} */
            var exchangeRates = this.getFromSession("currencyexchangerates");
            if (exchangeRates) {
                /** @type {?} */
                var exchange = exchangeRates.filter((/**
                 * @param {?} x
                 * @return {?}
                 */
                function (x) { return x.BaseCurrency == convertFrom.trim() && x.ConvertedCurrency == convertTo.trim(); }));
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
    };
    /**
     * @param {?} hld
     * @return {?}
     */
    WeekComponent.prototype.addHolidays = /**
     * @param {?} hld
     * @return {?}
     */
    function (hld) {
        this.week.forEach((/**
         * @param {?} w
         * @return {?}
         */
        function (w) {
            /** @type {?} */
            var h = hld.filter((/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
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
    };
    /**
     * @param {?} ann
     * @return {?}
     */
    WeekComponent.prototype.addAnnotation = /**
     * @param {?} ann
     * @return {?}
     */
    function (ann) {
        var _this = this;
        this.week.forEach((/**
         * @param {?} w
         * @return {?}
         */
        function (w) {
            /** @type {?} */
            var h = ann.filter((/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                return d.day === w.day;
            }));
            if (w.isCurrentMonth) {
                if (h.length > 0) {
                    w.annotation = h[0].text;
                    if (w.annotation != '' && _this.currency && _this.currencySymbol) {
                        /** @type {?} */
                        var changedCurrency = _this.getFromLocalStorage('currencysymbol');
                        /** @type {?} */
                        var amount = w.annotation.split(changedCurrency)[1];
                        w.annotation = changedCurrency + _this.convertCurrency(parseInt(amount));
                    }
                    w.highlight = h[0].highlight;
                }
            }
        }));
        if (this.ref && !((/** @type {?} */ (this.ref))).destroy) {
            this.ref.detectChanges();
        }
    };
    /**
     * @param {?} e
     * @param {?} d
     * @return {?}
     */
    WeekComponent.prototype.selectDate = /**
     * @param {?} e
     * @param {?} d
     * @return {?}
     */
    function (e, d) {
        var _this = this;
        this.zone.runOutsideAngular((/**
         * @return {?}
         */
        function () {
            e.stopPropagation();
            if (d.isActive && d.isCurrentMonth && d.annotation && d.annotation != '') {
                _this.dateSelected.emit(('00' + d.day).slice(-2) + '-' + ('00' + d.month).slice(-2) + '-' + d.year);
                // d.isSelected = !d.isSelected;
                _this.ref.detectChanges();
            }
        }));
    };
    /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    WeekComponent.prototype.trackByFn = /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    function (index, item) {
        return item.id;
    };
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
    WeekComponent.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
        { type: NgZone },
        { type: ChangeDetectorRef }
    ]; };
    WeekComponent.propDecorators = {
        week: [{ type: Input }],
        weekendClass: [{ type: Input }],
        vertical: [{ type: Input }],
        currency: [{ type: Input }],
        currencySymbol: [{ type: Input }],
        dateSelected: [{ type: Output }]
    };
    return WeekComponent;
}());
export { WeekComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vlay5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9iaS1kYXRlcGlja2VyLyIsInNvdXJjZXMiOlsibGliL3dlZWsvd2Vlay5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQVcsTUFBTSxlQUFlLENBQUM7QUFJaEksT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFHcEQ7SUFRSSx1QkFBeUMsUUFBYSxFQUFVLElBQVksRUFBVSxHQUFzQjtRQUE1RyxpQkFDQztRQUR3QyxhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFVLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBSW5HLGlCQUFZLEdBQVcsRUFBRSxDQUFBO1FBSXhCLGlCQUFZLEdBQXlCLElBQUksWUFBWSxFQUFFLENBQUM7UUFZbEUsdUJBQWtCOzs7OztRQUFHLFVBQUMsR0FBVyxFQUFFLEdBQVE7WUFDdkMsSUFBSSxpQkFBaUIsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ2xDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLFdBQVcsRUFBRTtvQkFDdkMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNsRDthQUNKO1FBQ0wsQ0FBQyxFQUFBO1FBRUQsd0JBQW1COzs7O1FBQUcsVUFBQyxHQUFXO1lBQzlCLElBQUk7Z0JBQ0EsSUFBSSxpQkFBaUIsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ2xDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLFdBQVcsRUFBRTt3QkFDdkMsT0FBTyxJQUFJLENBQUMsS0FB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QzNCLHVDQUFpQzs7SUFDakMscUNBQWtFOztJQVlsRSwyQ0FNQzs7SUFFRCw0Q0FXQzs7Ozs7SUF2Q1csaUNBQTBDOzs7OztJQUFFLDZCQUFvQjs7Ozs7SUFBRSw0QkFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBQTEFURk9STV9JRCwgTmdab25lLCBDaGFuZ2VEZXRlY3RvclJlZiwgVmlld1JlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBEYXkgfSBmcm9tICcuLi9tb2RlbHMvZGF5JztcclxuaW1wb3J0IHsgSG9saWRheSB9IGZyb20gJy4uL21vZGVscy9ob2xpZGF5JztcclxuaW1wb3J0IHsgQW5ub3RhdGlvbiB9IGZyb20gJy4uL21vZGVscy9hbm5vdGF0aW9uJztcclxuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdiaS13ZWVrJyxcclxuICAgIHN0eWxlVXJsczogWyd3ZWVrLmNvbXBvbmVudC5jc3MnXSxcclxuICAgIHRlbXBsYXRlVXJsOiAnd2Vlay5jb21wb25lbnQuaHRtbCdcclxuICAgIC8vdGVtcGxhdGU6YDxoMT5kczwvaDE+YFxyXG59KVxyXG5leHBvcnQgY2xhc3MgV2Vla0NvbXBvbmVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybTogYW55LCBwcml2YXRlIHpvbmU6IE5nWm9uZSwgcHJpdmF0ZSByZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KCkgd2VlazogRGF5W107XHJcbiAgICBASW5wdXQoKSB3ZWVrZW5kQ2xhc3M6IHN0cmluZyA9IFwiXCJcclxuICAgIEBJbnB1dCgpIHZlcnRpY2FsOiBib29sZWFuO1xyXG4gICAgQElucHV0KCkgY3VycmVuY3k/OiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBjdXJyZW5jeVN5bWJvbD86IHN0cmluZztcclxuICAgIEBPdXRwdXQoKSBkYXRlU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxTdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgLy8gYW5ub3RhdGlvbnM6QW5ub3RhdGlvbltdO1xyXG4gICAgZ2V0RnJvbVNlc3Npb24oa2V5KSB7XHJcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAga2VlcEluU2Vzc2lvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm0pKSB7XHJcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAga2VlcEluTG9jYWxTdG9yYWdlID0gKGtleTogc3RyaW5nLCB2YWw6IGFueSk6IGFueSA9PiB7XHJcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm0pKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKGxvY2FsU3RvcmFnZSkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RnJvbUxvY2FsU3RvcmFnZSA9IChrZXk6IHN0cmluZyk6IGFueSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm0pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChsb2NhbFN0b3JhZ2UpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5ID8ga2V5IDogJycpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb252ZXJ0Q3VycmVuY3koYW1vdW50OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBjb252ZXJ0ZWRBbW91bnQ6IG51bWJlciA9IGFtb3VudDtcclxuICAgICAgICBsZXQgY29udmVydEZyb206IHN0cmluZyA9IHRoaXMuY3VycmVuY3k7XHJcbiAgICAgICAgbGV0IGNvbnZlcnRUbzogc3RyaW5nID0gdGhpcy5nZXRGcm9tTG9jYWxTdG9yYWdlKFwiY3VycmVuY3lcIik7XHJcbiAgICAgICAgaWYgKGNvbnZlcnRGcm9tICYmIGNvbnZlcnRUbyAmJiBjb252ZXJ0RnJvbS50cmltKCkgIT0gY29udmVydFRvLnRyaW0oKSkge1xyXG4gICAgICAgICAgICBsZXQgZXhjaGFuZ2VSYXRlcyA9IHRoaXMuZ2V0RnJvbVNlc3Npb24oXCJjdXJyZW5jeWV4Y2hhbmdlcmF0ZXNcIik7XHJcbiAgICAgICAgICAgIGlmIChleGNoYW5nZVJhdGVzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZXhjaGFuZ2UgPSBleGNoYW5nZVJhdGVzLmZpbHRlcih4ID0+IHguQmFzZUN1cnJlbmN5ID09IGNvbnZlcnRGcm9tLnRyaW0oKSAmJiB4LkNvbnZlcnRlZEN1cnJlbmN5ID09IGNvbnZlcnRUby50cmltKCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGV4Y2hhbmdlICE9IHVuZGVmaW5lZCAmJiBleGNoYW5nZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZWRBbW91bnQgPSBNYXRoLnJvdW5kKGFtb3VudCAqIGV4Y2hhbmdlWzBdLkV4Y2hhbmdlUmF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmtlZXBJbkxvY2FsU3RvcmFnZShcImN1cnJlbmN5c3ltYm9sXCIsIHRoaXMuY3VycmVuY3lTeW1ib2wpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMua2VlcEluTG9jYWxTdG9yYWdlKFwiY3VycmVuY3lcIiwgdGhpcy5jdXJyZW5jeSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRlZEFtb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRIb2xpZGF5cyhobGQ6IEhvbGlkYXlbXSkge1xyXG4gICAgICAgIHRoaXMud2Vlay5mb3JFYWNoKCh3KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBoOiBIb2xpZGF5W10gPSBobGQuZmlsdGVyKChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoZC5kYXkpID09PSBwYXJzZUludCh3LmRheSlcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHcuaXNDdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChoLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB3LmlzSG9saWRheSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdy50b29sVGlwID0gaFswXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgfVxyXG4gICAgYWRkQW5ub3RhdGlvbihhbm46IEFubm90YXRpb25bXSkge1xyXG4gICAgICAgIHRoaXMud2Vlay5mb3JFYWNoKCh3KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBoOiBBbm5vdGF0aW9uW10gPSBhbm4uZmlsdGVyKChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZC5kYXkgPT09IHcuZGF5XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmICh3LmlzQ3VycmVudE1vbnRoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdy5hbm5vdGF0aW9uID0gaFswXS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh3LmFubm90YXRpb24gIT0gJycgJiYgdGhpcy5jdXJyZW5jeSAmJiB0aGlzLmN1cnJlbmN5U3ltYm9sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGFuZ2VkQ3VycmVuY3kgPSB0aGlzLmdldEZyb21Mb2NhbFN0b3JhZ2UoJ2N1cnJlbmN5c3ltYm9sJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhbW91bnQgPSB3LmFubm90YXRpb24uc3BsaXQoY2hhbmdlZEN1cnJlbmN5KVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdy5hbm5vdGF0aW9uID0gY2hhbmdlZEN1cnJlbmN5ICsgdGhpcy5jb252ZXJ0Q3VycmVuY3kocGFyc2VJbnQoYW1vdW50KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHcuaGlnaGxpZ2h0ID0gaFswXS5oaWdobGlnaHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBpZih0aGlzLnJlZiAmJiAhKHRoaXMucmVmIGFzIFZpZXdSZWYpLmRlc3Ryb3kpe1xyXG4gICAgICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0RGF0ZShlOiBFdmVudCwgZDogRGF5KSB7XHJcbiAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgaWYgKGQuaXNBY3RpdmUgJiYgZC5pc0N1cnJlbnRNb250aCAmJiBkLmFubm90YXRpb24gJiYgZC5hbm5vdGF0aW9uICE9ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVTZWxlY3RlZC5lbWl0KCgnMDAnICsgZC5kYXkpLnNsaWNlKC0yKSArICctJyArICgnMDAnICsgZC5tb250aCkuc2xpY2UoLTIpICsgJy0nICsgZC55ZWFyKTtcclxuICAgICAgICAgICAgICAgICAgLy8gZC5pc1NlbGVjdGVkID0gIWQuaXNTZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhY2tCeUZuKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW0uaWQ7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==