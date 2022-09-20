/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ViewChildren, QueryList, Output, EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';
import * as momentimp from 'moment';
import { WeekComponent } from '../week/week.component';
import { BiDatepickerService } from '../bi-datepicker.service';
/** @type {?} */
const moment = momentimp;
export class MonthComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGguY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmktZGF0ZXBpY2tlci8iLCJzb3VyY2VzIjpbImxpYi9tb250aC9tb250aC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUF5QixZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUU1SyxPQUFPLEtBQUssU0FBUyxNQUFNLFFBQVEsQ0FBQztBQUNwQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFLdkQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7O01BR3pELE1BQU0sR0FBRyxTQUFTO0FBUXhCLE1BQU0sT0FBTyxjQUFjOzs7Ozs7SUFLdkIsWUFBb0IsSUFBWSxFQUFVLEdBQXNCLEVBQVUsT0FBNEI7UUFBbEYsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFVLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7UUFLNUYsaUJBQVksR0FBVyxJQUFJLENBQUM7UUFJN0IsaUJBQVksR0FBVyxFQUFFLENBQUM7UUFDMUIsa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFPcEMsaUJBQVksR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVFqRCxVQUFLLEdBQVksRUFBRSxDQUFDO1FBQ3BCLGNBQVMsR0FBVyxFQUFFLENBQUM7UUFDOUIsZUFBVSxHQUFHLEVBQUUsQ0FBQztJQTFCaEIsQ0FBQzs7Ozs7SUFMRCxXQUFXLENBQUMsT0FBc0I7UUFDOUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7Ozs7SUFxQkQsUUFBUTtRQUNKLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN6QixDQUFDOzs7O0lBQ0QsZUFBZTtJQUVmLENBQUM7Ozs7O0lBV0QsV0FBVyxDQUFDLEdBQWE7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7O1lBQ2hCLElBQUksR0FBYyxFQUFFO1FBQ3hCLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUN6QyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTzs7OztnQkFBQyxDQUFDLENBQUMsRUFBRSxFQUFFOzt3QkFDcEIsQ0FBQyxHQUFjLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU07Ozs7b0JBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTTs7OztvQkFBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQztvQkFDN0gsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDZCxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixrQkFBa0I7cUJBQ3JCO2dCQUNMLENBQUMsRUFBQyxDQUFBO2FBQ0w7U0FDSjtRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDekIsY0FBYztJQUNsQixDQUFDOzs7OztJQUVELGNBQWMsQ0FBQyxHQUFnQjtRQUUzQixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQzs7WUFDbEIsSUFBSSxHQUFpQixFQUFFO1FBQzNCLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRTtZQUNoRCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTzs7OztnQkFBQyxDQUFDLENBQUMsRUFBRSxFQUFFOzt3QkFDcEIsQ0FBQyxHQUFpQixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNOzs7O29CQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU07Ozs7b0JBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7b0JBQ2pILElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7d0JBQ2QsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkIsa0JBQWtCO3FCQUNyQjtvQkFDRCwwQkFBMEI7Z0JBQzlCLENBQUMsRUFBQyxDQUFBO2FBQ0w7WUFDRCw0QkFBNEI7U0FDL0I7UUFDRCxjQUFjO0lBQ2xCLENBQUM7Ozs7O0lBS08sYUFBYTs7O1lBRWIsR0FBRyxHQUFHLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQzs7WUFDckUsUUFBUSxHQUFXLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs7WUFDaEQsTUFBTSxHQUFXLEdBQUcsQ0FBQyxXQUFXLEVBQUU7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztZQUNoQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFOztZQUVuRCxRQUFRLEdBQVksRUFBRTs7WUFDdEIsVUFBVSxHQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckUsSUFBSSxVQUFVLElBQUksSUFBSSxFQUFFO1lBRXBCLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7O2dCQUNkLE1BQU0sR0FBYSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7O2dCQUN2QyxJQUFJLEdBQVcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Z0JBQ2xDLElBQUksR0FBVyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOztnQkFDbEMsSUFBSSxHQUFXLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7O2dCQUNsQyxFQUFFLEdBQVcsQ0FBQztZQUNsQiwwQ0FBMEM7WUFDMUMsS0FBSyxJQUFJLENBQUMsR0FBRyxVQUFVLEdBQUcsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25FLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQUE7b0JBQ2IsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFO29CQUMvRCxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtvQkFDakIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO29CQUM1QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQzFCLGNBQWMsRUFBRSxLQUFLO29CQUNyQixRQUFRLEVBQUUsS0FBSztvQkFDZixVQUFVLEVBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hHLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLOztvQkFDakQsU0FBUyxFQUFFLEtBQUs7b0JBQ2hCLE9BQU8sRUFBRSxFQUFFO2lCQUNkLEVBQU8sQ0FBQyxDQUFDO2dCQUNWLHFDQUFxQzthQUN4Qzs7Z0JBRUcsQ0FBQyxHQUFXLENBQUM7O2dCQUNiLEtBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ25DLHFDQUFxQztZQUNyQyxLQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUUvQixHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7b0JBR25FLEdBQUcsR0FBVyxJQUFJOztvQkFBRSxJQUFJLEdBQVksSUFBSTtnQkFDNUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFdBQVcsRUFBRTtvQkFDdEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7aUJBQ2pEO2dCQUNELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxXQUFXLEVBQUU7b0JBQ3RDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDO2lCQUNsRDtnQkFFRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFBO29CQUNiLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRTtvQkFDL0QsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUU7b0JBQ3JCLGNBQWMsRUFBRSxJQUFJO29CQUNwQixRQUFRLEVBQUUsR0FBRyxJQUFJLElBQUk7b0JBQ3JCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtvQkFDNUIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUMxQixTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSzs7b0JBQ2pELFVBQVUsRUFBRSxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDbEcsRUFBTyxDQUFDLENBQUM7YUFDakI7O2dCQUNHLEVBQUUsR0FBRyxJQUFJO1lBQ2IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFHeEIsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDeEIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O3dCQUNuRSxHQUFHLEdBQVUsSUFBSTs7d0JBQUUsSUFBSSxHQUFZLElBQUk7b0JBQzNDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxXQUFXLEVBQUU7d0JBQ3RDLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDO3FCQUVqRDtvQkFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksV0FBVyxFQUFFO3dCQUN0QyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztxQkFHbEQ7b0JBQ0csUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUM5QixtQkFBQTt3QkFDSSxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUU7d0JBQy9ELEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFO3dCQUNyQixjQUFjLEVBQUUsRUFBRTt3QkFDbEIsUUFBUSxFQUFFLEdBQUcsSUFBSSxJQUFJLElBQUksRUFBRTt3QkFDM0IsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO3dCQUM1QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7d0JBQzFCLFNBQVMsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUs7O3dCQUNuRSxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQztxQkFHakgsRUFBTyxDQUNYLENBQUM7b0JBRU4sSUFBSSxDQUFDLEdBQUcsTUFBTSxFQUFFO3dCQUNaLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ04sRUFBRSxHQUFHLEtBQUssQ0FBQztxQkFDZDtpQkFDSjtnQkFDRCxJQUFJLENBQUMsRUFBRSxFQUFFO29CQUNMLE1BQU07aUJBQ1Q7YUFFSjtZQUNELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDekQ7YUFDSTtZQUNELFFBQVEsR0FBRyxVQUFVLENBQUM7U0FDekI7UUFHRCx5QkFBeUI7UUFDekIsNEJBQTRCO1FBRTVCLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUc7Ozs7O1FBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDeEMsT0FBTztnQkFDSCxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ25FLFFBQVEsRUFBRSxDQUFDO2FBQ2QsQ0FBQTtRQUNMLENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7Ozs7O0lBRUQsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNuQixDQUFDOzs7OztJQUNELGNBQWMsQ0FBQyxJQUFZO1FBQ3ZCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWpDLENBQUM7OztZQXROSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLFVBQVU7Z0JBRXBCLG9qQ0FBbUM7O2FBQ3RDOzs7O1lBbEJnRyxNQUFNO1lBQUUsaUJBQWlCO1lBUWpILG1CQUFtQjs7O3VCQW1CdkIsWUFBWSxTQUFDLGFBQWE7MkJBRTFCLEtBQUs7bUJBQ0wsS0FBSztvQkFDTCxLQUFLO21CQUNMLEtBQUs7MkJBQ0wsS0FBSzs0QkFDTCxLQUFLO3NCQUNMLEtBQUs7c0JBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7NkJBQ0wsS0FBSzsyQkFDTCxNQUFNOzs7O0lBYlAsa0NBQ21DOztJQUNuQyxzQ0FBc0M7O0lBQ3RDLDhCQUFzQjs7SUFDdEIsK0JBQXVCOztJQUN2Qiw4QkFBc0I7O0lBQ3RCLHNDQUFtQzs7SUFDbkMsdUNBQW9DOztJQUNwQyxpQ0FBeUI7O0lBQ3pCLGlDQUF5Qjs7SUFDekIsa0NBQTJCOztJQUMzQixrQ0FBMkI7O0lBQzNCLHdDQUFpQzs7SUFDakMsc0NBQ3dEOztJQVF4RCwrQkFBMkI7O0lBQzNCLG1DQUE4Qjs7SUFDOUIsb0NBQWdCOztJQUloQixvQ0FBd0I7O0lBRXhCLGtDQUFtQjs7Ozs7SUFqQ1AsOEJBQW9COzs7OztJQUFFLDZCQUE4Qjs7Ozs7SUFBRSxpQ0FBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQsIEFmdGVyVmlld0luaXQsIFZpZXdDaGlsZHJlbiwgUXVlcnlMaXN0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgTmdab25lLCBDaGFuZ2VEZXRlY3RvclJlZiwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IERheSB9IGZyb20gJy4uL21vZGVscy9kYXknO1xyXG5pbXBvcnQgKiBhcyBtb21lbnRpbXAgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0IHsgV2Vla0NvbXBvbmVudCB9IGZyb20gJy4uL3dlZWsvd2Vlay5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBbm5vdGF0aW9ucyB9IGZyb20gJy4uL21vZGVscy9hbm5vdGF0aW9ucyc7XHJcbmltcG9ydCB7IEhvbGlkYXlzIH0gZnJvbSAnLi4vbW9kZWxzL2hvbGlkYXlzJztcclxuaW1wb3J0IHsgSG9saWRheSB9IGZyb20gJy4uL21vZGVscy9ob2xpZGF5JztcclxuaW1wb3J0IHsgQW5ub3RhdGlvbiB9IGZyb20gJy4uL21vZGVscy9hbm5vdGF0aW9uJztcclxuaW1wb3J0IHsgQmlEYXRlcGlja2VyU2VydmljZSB9IGZyb20gJy4uL2JpLWRhdGVwaWNrZXIuc2VydmljZSc7XHJcblxyXG5cclxuY29uc3QgbW9tZW50ID0gbW9tZW50aW1wO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdiaS1tb250aCcsXHJcbiAgICBzdHlsZVVybHM6IFsnbW9udGguY29tcG9uZW50LmNzcyddLFxyXG4gICAgdGVtcGxhdGVVcmw6ICdtb250aC5jb21wb25lbnQuaHRtbCdcclxufSlcclxuZXhwb3J0IGNsYXNzIE1vbnRoQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMge1xyXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVXZWVrcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgem9uZTogTmdab25lLCBwcml2YXRlIHJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsIHByaXZhdGUgc2VydmljZTogQmlEYXRlcGlja2VyU2VydmljZSkge1xyXG4gICAgfVxyXG5cclxuICAgIEBWaWV3Q2hpbGRyZW4oV2Vla0NvbXBvbmVudClcclxuICAgIGNtcFdlZWtzOiBRdWVyeUxpc3Q8V2Vla0NvbXBvbmVudD47XHJcbiAgICBASW5wdXQoKSAgc2hvd1NlbGVjdGVkOmJvb2xlYW4gPSB0cnVlO1xyXG4gICAgQElucHV0KCkgRGF0ZTogU3RyaW5nO1xyXG4gICAgQElucHV0KCkgbW9udGg6IG51bWJlcjtcclxuICAgIEBJbnB1dCgpIHllYXI6IG51bWJlcjtcclxuICAgIEBJbnB1dCgpIHdlZWtlbmRDbGFzczogc3RyaW5nID0gXCJcIjtcclxuICAgIEBJbnB1dCgpIGluQWN0aXZlQ2xhc3M6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBASW5wdXQoKSBtaW5EYXRlOiBudW1iZXI7XHJcbiAgICBASW5wdXQoKSBtYXhEYXRlOiBudW1iZXI7XHJcbiAgICBASW5wdXQoKSB2ZXJ0aWNhbDogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpIGN1cnJlbmN5Pzogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgY3VycmVuY3lTeW1ib2w/OiBzdHJpbmc7XHJcbiAgICBAT3V0cHV0KClcclxuICAgIGRhdGVTZWxlY3RlZDogRXZlbnRFbWl0dGVyPFN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVdlZWtzKCk7XHJcbiAgICB9XHJcbiAgICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG4gICAgcHVibGljIHdlZWtzOiBEYXlbXVtdID0gW107XHJcbiAgICBwdWJsaWMgbW9udGhOYW1lOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgd2Vla1dpdGhJZCA9IFtdO1xyXG5cclxuXHJcbiAgICAvL0BJbnB1dCgpXHJcbiAgICBhbm5vdGF0aW9uOiBBbm5vdGF0aW9ucztcclxuICAgIC8vIEBJbnB1dCgpXHJcbiAgICBob2xpZGF5czogSG9saWRheXM7XHJcblxyXG4gICAgYWRkSG9saWRheXMoaGxkOiBIb2xpZGF5cykge1xyXG4gICAgICAgIHRoaXMuaG9saWRheXMgPSBobGQ7XHJcbiAgICAgICAgbGV0IGhsZHM6IEhvbGlkYXlbXSA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLmhvbGlkYXlzICYmIHRoaXMuaG9saWRheXMuaG9saWRheXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaG9saWRheXMuaG9saWRheXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbXBXZWVrcy5mb3JFYWNoKChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGg6IEhvbGlkYXlbXSA9IHRoaXMuaG9saWRheXMuaG9saWRheXMuZmlsdGVyKCh4KSA9PiBkLndlZWsuZmlsdGVyKCh3KSA9PiBwYXJzZUludCh3LmRheSkgPT09IHBhcnNlSW50KHguZGF5KSkubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGgubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkLmFkZEhvbGlkYXlzKGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2hsZHMucHVzaChoWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgICAgICAvL3JldHVybiBobGRzO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEFubm90YXRpb25zKGFubjogQW5ub3RhdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hbm5vdGF0aW9uID0gYW5uO1xyXG4gICAgICAgIGxldCBhbm5zOiBBbm5vdGF0aW9uW10gPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5hbm5vdGF0aW9uICYmIHRoaXMuYW5ub3RhdGlvbi5hbm5vdGF0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hbm5vdGF0aW9uLmFubm90YXRpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY21wV2Vla3MuZm9yRWFjaCgoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBoOiBBbm5vdGF0aW9uW10gPSB0aGlzLmFubm90YXRpb24uYW5ub3RhdGlvbnMuZmlsdGVyKCh4KSA9PiBkLndlZWsuZmlsdGVyKCh3KSA9PiB3LmRheSA9PT0geC5kYXkpLmxlbmd0aCA+IDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChoLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZC5hZGRBbm5vdGF0aW9uKGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2hsZHMucHVzaChoWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy9kWydydW50aW1lJ10gPSAndGhlbmdhJztcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmNtcFdlZWtzKVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL3JldHVybiBobGRzO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIHByaXZhdGUgZ2VuZXJhdGVXZWVrcygpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnZ2VuZXJhdGluZyB3ZWVrcycsIHRoaXMubW9udGgpO1xyXG4gICAgICAgIGxldCBjYWwgPSBtb21lbnQoKS55ZWFyKHRoaXMueWVhcikubW9udGgodGhpcy5tb250aCAtIDEpLnN0YXJ0T2YoJ21vbnRoJyk7XHJcbiAgICAgICAgbGV0IHN0YXJ0RGF5OiBudW1iZXIgPSBwYXJzZUludChjYWwuZm9ybWF0KCdkJyksIDEwKTtcclxuICAgICAgICBsZXQgZW5kRGF5OiBudW1iZXIgPSBjYWwuZGF5c0luTW9udGgoKTtcclxuICAgICAgICB0aGlzLm1vbnRoTmFtZSA9IGNhbC5mb3JtYXQoJ01NTU0nKTtcclxuICAgICAgICB2YXIgcHJldkVuZERheSA9IGNhbC5zdWJ0cmFjdCgxLCBcIm1vbnRoXCIpLmRheXNJbk1vbnRoKCk7XHJcblxyXG4gICAgICAgIGxldCB3ZWVrZGF5czogRGF5W11bXSA9IFtdO1xyXG4gICAgICAgIGxldCBtb250aENhY2hlOiBEYXlbXVtdID0gdGhpcy5zZXJ2aWNlLmdldE1vbnRoKGNhbC5mb3JtYXQoXCJZWVlZTU1cIikpO1xyXG4gICAgICAgIGlmIChtb250aENhY2hlID09IG51bGwpIHtcclxuXHJcbiAgICAgICAgICAgIHdlZWtkYXlzLnB1c2goW10pO1xyXG4gICAgICAgICAgICBsZXQgZGF0ZUluOiBzdHJpbmdbXSA9IHRoaXMuRGF0ZS5zcGxpdCgnLScpO1xyXG4gICAgICAgICAgICBsZXQgZG1JbjogbnVtYmVyID0gcGFyc2VJbnQoZGF0ZUluWzFdKTtcclxuICAgICAgICAgICAgbGV0IGR5SW46IG51bWJlciA9IHBhcnNlSW50KGRhdGVJblsyXSk7XHJcbiAgICAgICAgICAgIGxldCBkZEluOiBudW1iZXIgPSBwYXJzZUludChkYXRlSW5bMF0pO1xyXG4gICAgICAgICAgICBsZXQgYzE6IG51bWJlciA9IDE7XHJcbiAgICAgICAgICAgIC8vIFByZXZpb3VzIE1vbnRoIGZpbGxpbmcgaW4gY3VycmVudCBtb250aFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gcHJldkVuZERheSAtIHN0YXJ0RGF5ICsgMSwgaiA9IHN0YXJ0RGF5OyBqID4gMDsgaSsrLCBqLS0pIHtcclxuICAgICAgICAgICAgICAgIHdlZWtkYXlzWzBdLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLnllYXIudG9TdHJpbmcoKSArIHRoaXMubW9udGgudG9TdHJpbmcoKSArIGkudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBkYXk6IGkudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBtb250aDogdGhpcy5tb250aC50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIHllYXI6IHRoaXMueWVhci50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzQ3VycmVudE1vbnRoOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBpc0FjdGl2ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZDp0aGlzLnNob3dTZWxlY3RlZCAmJiAoICh0aGlzLm1vbnRoID09IGRtSW4gJiYgdGhpcy55ZWFyID09IGR5SW4gJiYgZGRJbiA9PSAoYzEgLSAxKSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzV2Vla2VuZDogd2Vla2RheXNbMF0ubGVuZ3RoID09IDAgPyB0cnVlIDogZmFsc2UsIC8vfHwgdGhpcy53ZWVrc1swXS5sZW5ndGg9PTZcclxuICAgICAgICAgICAgICAgICAgICBpc0hvbGlkYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvb2xUaXA6ICcnLFxyXG4gICAgICAgICAgICAgICAgfSBhcyBEYXkpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cod2Vla2RheXMsIFwid2Vla2RheXNcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBjOiBudW1iZXIgPSAxO1xyXG4gICAgICAgICAgICBsZXQgY2RhdGUgPSBtb21lbnQoKS5zdGFydE9mKCdkYXknKTtcclxuICAgICAgICAgICAgLy9jdXJyZW50IG1vbnRoIGFmdGVyIHByZXZpb3VzIG1vbnRoO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gc3RhcnREYXk7IGkgPCA3OyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjYWwgPSBjYWwueWVhcih0aGlzLnllYXIpLm1vbnRoKHRoaXMubW9udGggLSAxKS5kYXRlKGMpLnN0YXJ0T2YoJ2RheScpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgYWN0OmJvb2xlYW4gPSB0cnVlLCBhY3QxOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHRoaXMubWluRGF0ZSkgIT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdCA9IGNhbC5kaWZmKGNkYXRlLCAnZGF5cycpID49IHRoaXMubWluRGF0ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHRoaXMubWF4RGF0ZSkgIT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdDEgPSBjYWwuZGlmZihjZGF0ZSwgJ2RheXMnKSA8PSB0aGlzLm1heERhdGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdlZWtkYXlzWzBdLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy55ZWFyLnRvU3RyaW5nKCkgKyB0aGlzLm1vbnRoLnRvU3RyaW5nKCkgKyBjLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRheTogKGMrKykudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDdXJyZW50TW9udGg6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlOiBhY3QgJiYgYWN0MSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IHRoaXMubW9udGgudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogdGhpcy55ZWFyLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzV2Vla2VuZDogd2Vla2RheXNbMF0ubGVuZ3RoID09IDAgPyB0cnVlIDogZmFsc2UsLy98fCB0aGlzLndlZWtzWzBdLmxlbmd0aD09NlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkOiB0aGlzLnNob3dTZWxlY3RlZCAmJiAoKHRoaXMubW9udGggPT0gZG1JbiAmJiB0aGlzLnllYXIgPT0gZHlJbiAmJiBkZEluID09IChjIC0gMSkpKSxcclxuICAgICAgICAgICAgICAgICAgICB9IGFzIERheSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGNtID0gdHJ1ZTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCA2OyBpKyspIHtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgd2Vla2RheXMucHVzaChbXSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDc7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbCA9IGNhbC55ZWFyKHRoaXMueWVhcikubW9udGgodGhpcy5tb250aCAtIDEpLmRhdGUoYykuc3RhcnRPZignZGF5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFjdDpib29sZWFuID10cnVlLCBhY3QxOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh0aGlzLm1pbkRhdGUpICE9IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0ID0gY2FsLmRpZmYoY2RhdGUsICdkYXlzJykgPj0gdGhpcy5taW5EYXRlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodGhpcy5tYXhEYXRlKSAhPSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdDEgPSBjYWwuZGlmZihjZGF0ZSwgJ2RheXMnKSA8PSB0aGlzLm1heERhdGU7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlZWtkYXlzW3dlZWtkYXlzLmxlbmd0aCAtIDFdLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRoaXMueWVhci50b1N0cmluZygpICsgdGhpcy5tb250aC50b1N0cmluZygpICsgYy50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRheTogKGMrKykudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0N1cnJlbnRNb250aDogY20sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNBY3RpdmU6IGFjdCAmJiBhY3QxICYmIGNtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiB0aGlzLm1vbnRoLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogdGhpcy55ZWFyLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNXZWVrZW5kOiB3ZWVrZGF5c1t3ZWVrZGF5cy5sZW5ndGggLSAxXS5sZW5ndGggPT0gMCA/IHRydWUgOiBmYWxzZSwgLy98fCB0aGlzLndlZWtzW3RoaXMud2Vla3MubGVuZ3RoIC0gMV0ubGVuZ3RoPT02IGZvciBzYXR1cmRheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ6IHRoaXMuc2hvd1NlbGVjdGVkICYmICgodGhpcy5tb250aCA9PSBkbUluICYmIHRoaXMueWVhciA9PSBkeUluICYmIGRkSW4gPT0gKGMgLSAxKSAmJiBjbSA9PT0gdHJ1ZSkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaXNJbkJldHdlZW46IG1vbWVudCh0aGlzLnllYXIgKyAnLScgKyB0aGlzLm1vbnRoICsgJy0nICsgKGMgLSAxKSkuaXNCZXR3ZWVuKGR5SW4gKyAnLScgKyBkbUluICsgJy0nICsgZGRJbiwgZHlPdXQgKyAnLScgKyBkbU91dCArICctJyArIGRkT3V0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaXNJbkJldHdlZW46ICh0aGlzLm1vbnRoID09ZG1JbiAmJiB0aGlzLnllYXIgPT0gZHlJbiAmJiBkZEluIDwgKGMtMSkgJiYgY20gPT09IHRydWUgKSAmJiAodGhpcy5tb250aCA9PSBkbU91dCAmJiB0aGlzLnllYXIgPT0gZHlPdXQgJiYgZGRPdXQgPiAoYy0xKSAmJiBjbSA9PT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgRGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjID4gZW5kRGF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghY20pIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLmFkZE1vbnRoKGNhbC5mb3JtYXQoXCJZWVlZTU1cIiksIHdlZWtkYXlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHdlZWtkYXlzID0gbW9udGhDYWNoZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvLyB0aGlzLndlZWtzID0gd2Vla2RheXM7XHJcbiAgICAgICAgLy8gdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG5cclxuICAgICAgICB0aGlzLndlZWtXaXRoSWQgPSB3ZWVrZGF5cy5tYXAoKHcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBpZDogdGhpcy55ZWFyLnRvU3RyaW5nKCkgKyB0aGlzLm1vbnRoLnRvU3RyaW5nKCkgKyBpbmRleC50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgd2Vla2RheXM6IHdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYWNrQnlGbihpbmRleCwgaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBpdGVtLmlkO1xyXG4gICAgfVxyXG4gICAgb25EYXRlU2VsZWN0ZWQoZGF0ZTogU3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5kYXRlU2VsZWN0ZWQuZW1pdChkYXRlKTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==