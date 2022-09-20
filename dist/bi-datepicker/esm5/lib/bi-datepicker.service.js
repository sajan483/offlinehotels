/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
var BiDatepickerService = /** @class */ (function () {
    function BiDatepickerService() {
        this.months = new Map();
    }
    /**
     * @param {?} month
     * @return {?}
     */
    BiDatepickerService.prototype.getMonth = /**
     * @param {?} month
     * @return {?}
     */
    function (month) {
        if (this.months.has(month)) {
            return this.months[month];
        }
        else {
            return null;
        }
    };
    /**
     * @param {?} key
     * @param {?} month
     * @return {?}
     */
    BiDatepickerService.prototype.addMonth = /**
     * @param {?} key
     * @param {?} month
     * @return {?}
     */
    function (key, month) {
        if (this.months.has(key)) {
            this.months.delete(key);
        }
        this.months.set(key, month);
    };
    BiDatepickerService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    BiDatepickerService.ctorParameters = function () { return []; };
    /** @nocollapse */ BiDatepickerService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function BiDatepickerService_Factory() { return new BiDatepickerService(); }, token: BiDatepickerService, providedIn: "root" });
    return BiDatepickerService;
}());
export { BiDatepickerService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    BiDatepickerService.prototype.months;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmktZGF0ZXBpY2tlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmktZGF0ZXBpY2tlci8iLCJzb3VyY2VzIjpbImxpYi9iaS1kYXRlcGlja2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRzNDO0lBS0U7UUFDUSxXQUFNLEdBQXlCLElBQUksR0FBRyxFQUFFLENBQUM7SUFEakMsQ0FBQzs7Ozs7SUFFVixzQ0FBUTs7OztJQUFmLFVBQWdCLEtBQWE7UUFDM0IsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMxQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDM0I7YUFDSTtZQUNILE9BQU8sSUFBSSxDQUFDO1NBQ2I7SUFDSCxDQUFDOzs7Ozs7SUFDTSxzQ0FBUTs7Ozs7SUFBZixVQUFnQixHQUFXLEVBQUUsS0FBYztRQUN6QyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pCO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7O2dCQXBCRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7Ozs4QkFMRDtDQXlCQyxBQXRCRCxJQXNCQztTQW5CWSxtQkFBbUI7Ozs7OztJQUc5QixxQ0FBaUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IERheSB9IGZyb20gJy4vbW9kZWxzL2RheSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBCaURhdGVwaWNrZXJTZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7IH1cclxuICBwcml2YXRlIG1vbnRoczogTWFwPFN0cmluZywgRGF5W11bXT4gPSBuZXcgTWFwKCk7XHJcbiAgcHVibGljIGdldE1vbnRoKG1vbnRoOiBzdHJpbmcpOiBEYXlbXVtdIHtcclxuICAgIGlmICh0aGlzLm1vbnRocy5oYXMobW9udGgpKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1vbnRoc1ttb250aF07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHB1YmxpYyBhZGRNb250aChrZXk6IHN0cmluZywgbW9udGg6IERheVtdW10pIHtcclxuICAgIGlmICh0aGlzLm1vbnRocy5oYXMoa2V5KSkge1xyXG4gICAgICB0aGlzLm1vbnRocy5kZWxldGUoa2V5KTtcclxuICAgIH1cclxuICAgIHRoaXMubW9udGhzLnNldChrZXksIG1vbnRoKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==