import { Component, Input, Output, EventEmitter, Inject, PLATFORM_ID, NgZone, ChangeDetectorRef, ViewRef } from '@angular/core';
import { Day } from '../models/day';
import { Holiday } from '../models/holiday';
import { Annotation } from '../models/annotation';
import { isPlatformBrowser } from '@angular/common';


@Component({
    selector: 'bi-week',
    styleUrls: ['week.component.css'],
    templateUrl: 'week.component.html'
    //template:`<h1>ds</h1>`
})
export class WeekComponent {

    constructor(@Inject(PLATFORM_ID) private platform: any, private zone: NgZone, private ref: ChangeDetectorRef) {
    }

    @Input() week: Day[];
    @Input() weekendClass: string = ""
    @Input() vertical: boolean;
    @Input() currency?: string;
    @Input() currencySymbol?: string;
    @Output() dateSelected: EventEmitter<String> = new EventEmitter();
    // annotations:Annotation[];
    getFromSession(key) {
        if (isPlatformBrowser(this.platform)) {
            return JSON.parse(sessionStorage.getItem(key));
        }
    }
    keepInSession(key, value) {
        if (isPlatformBrowser(this.platform)) {
            sessionStorage.setItem(key, value);
        }
    }
    keepInLocalStorage = (key: string, val: any): any => {
        if (isPlatformBrowser(this.platform)) {
            if (typeof (localStorage) !== "undefined") {
                localStorage.setItem(key, JSON.stringify(val));
            }
        }
    }

    getFromLocalStorage = (key: string): any => {
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
    }
    convertCurrency(amount: number): number {
        let convertedAmount: number = amount;
        let convertFrom: string = this.currency;
        let convertTo: string = this.getFromLocalStorage("currency");
        if (convertFrom && convertTo && convertFrom.trim() != convertTo.trim()) {
            let exchangeRates = this.getFromSession("currencyexchangerates");
            if (exchangeRates) {
                let exchange = exchangeRates.filter(x => x.BaseCurrency == convertFrom.trim() && x.ConvertedCurrency == convertTo.trim());
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

    addHolidays(hld: Holiday[]) {
        this.week.forEach((w) => {
            let h: Holiday[] = hld.filter((d) => {
                return parseInt(d.day) === parseInt(w.day)

            });

            if (w.isCurrentMonth) {
                if (h.length > 0) {
                    w.isHoliday = true;
                    w.toolTip = h[0].name;
                }
            }
        });
        this.ref.detectChanges();
    }
    addAnnotation(ann: Annotation[]) {
        this.week.forEach((w) => {
            let h: Annotation[] = ann.filter((d) => {
                return d.day === w.day

            });

            if (w.isCurrentMonth) {
                if (h.length > 0) {
                    w.annotation = h[0].text;
                    if (w.annotation != '' && this.currency && this.currencySymbol) {
                        let changedCurrency = this.getFromLocalStorage('currencysymbol');
                        let amount = w.annotation.split(changedCurrency)[1];
                        w.annotation = changedCurrency + this.convertCurrency(parseInt(amount));
                    }
                    w.highlight = h[0].highlight;
                }
            }
        });
        if(this.ref && !(this.ref as ViewRef).destroy){
        this.ref.detectChanges();
        }
    }

    selectDate(e: Event, d: Day) {
        this.zone.runOutsideAngular(() => {
            e.stopPropagation();
            if (d.isActive && d.isCurrentMonth && d.annotation && d.annotation != '') {
                this.dateSelected.emit(('00' + d.day).slice(-2) + '-' + ('00' + d.month).slice(-2) + '-' + d.year);
                  // d.isSelected = !d.isSelected;
                  this.ref.detectChanges();
            }
        });
    }

    trackByFn(index, item) {
        return item.id;
    }

}
