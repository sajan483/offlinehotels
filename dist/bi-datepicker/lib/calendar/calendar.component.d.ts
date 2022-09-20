import { OnInit, EventEmitter, QueryList, AfterViewInit, ComponentFactoryResolver, NgZone, ChangeDetectorRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { MonthComponent } from '../month/month.component';
import { MonthYear } from '../models/monthyear';
import { Annotations } from '../models/annotations';
import { Holidays } from '../models/holidays';
import { Subscription } from 'rxjs';
export declare class CalendarComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    private r;
    private zone;
    private platform;
    cRef: ChangeDetectorRef;
    cmpMonths: QueryList<MonthComponent>;
    private slider;
    private monthParent;
    months: number;
    Date: string;
    weekendClass: string;
    minDate: number;
    maxDate: number;
    vertical: boolean;
    currency?: string;
    currencySymbol?: string;
    monthChanged: EventEmitter<MonthYear>;
    month: MonthYear[];
    private annotations;
    private holidays;
    dateSelected: EventEmitter<String>;
    date: string;
    difference: number;
    scrollSubscription: Subscription;
    showSelected: boolean;
    constructor(r: ComponentFactoryResolver, zone: NgZone, platform: any, cRef: ChangeDetectorRef);
    ngAfterViewInit(): void;
    ngOnInit(): void;
    trackByFn(index: any, item: any): any;
    private initMonths;
    prevMonth(status?: any): void;
    nextMonth(): void;
    addAnnotations(annotation: Annotations): void;
    removeAnnotations(month: number, year: number): void;
    addHolidays(holidays: Holidays): void;
    removeHolidays(month: number, year: number): void;
    onDateSelected(date: string): void;
    onDateChanged(date: string): void;
    scrollEvent(eve: any): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
}