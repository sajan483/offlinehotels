import { OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { MonthYear } from '../models/monthyear';
import { Annotations } from '../models/annotations';
import { Holidays } from '../models/holidays';
export declare class BiDatepickerComponent implements OnInit, AfterViewInit {
    calendar: CalendarComponent;
    constructor();
    months: number;
    Date: String;
    isOpen: boolean;
    weekendClass: string;
    vertical: boolean;
    monthChanged: EventEmitter<any>;
    open: EventEmitter<boolean>;
    dateSelected: EventEmitter<String>;
    minDate: number;
    maxDate: number;
    ngOnInit(): void;
    toggleCalendar(): void;
    ngAfterViewInit(): void;
    onMonthChanged(my: MonthYear): void;
    addAnnotations(annotation: Annotations): void;
    addHolidays(holidays: Holidays): void;
    onDateSelected(date: String): void;
}
