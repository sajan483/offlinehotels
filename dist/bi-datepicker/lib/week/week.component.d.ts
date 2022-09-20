import { EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';
import { Day } from '../models/day';
import { Holiday } from '../models/holiday';
import { Annotation } from '../models/annotation';
export declare class WeekComponent {
    private platform;
    private zone;
    private ref;
    constructor(platform: any, zone: NgZone, ref: ChangeDetectorRef);
    week: Day[];
    weekendClass: string;
    vertical: boolean;
    currency?: string;
    currencySymbol?: string;
    dateSelected: EventEmitter<String>;
    getFromSession(key: any): any;
    keepInSession(key: any, value: any): void;
    keepInLocalStorage: (key: string, val: any) => any;
    getFromLocalStorage: (key: string) => any;
    convertCurrency(amount: number): number;
    addHolidays(hld: Holiday[]): void;
    addAnnotation(ann: Annotation[]): void;
    selectDate(e: Event, d: Day): void;
    trackByFn(index: any, item: any): any;
}
