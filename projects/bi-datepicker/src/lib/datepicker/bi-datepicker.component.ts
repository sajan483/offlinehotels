import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { MonthYear } from '../models/monthyear';
import { Annotations } from '../models/annotations';
import { Holidays } from '../models/holidays';


@Component({
  selector: 'bi-datepicker',
  templateUrl: 'bi-datepicker.component.html',
  styles: []
})
export class BiDatepickerComponent implements OnInit, AfterViewInit {


  @ViewChild(CalendarComponent, { static: false })
  calendar: CalendarComponent;


  constructor() { }

  @Input()
  months: number;

  @Input()
  Date: String;

  isOpen: boolean = false;

  @Input()
  weekendClass: string = ""

  @Input()
  vertical: boolean;

  @Output()
  monthChanged: EventEmitter<any> = new EventEmitter();

  @Output()
  open: EventEmitter<boolean> = new EventEmitter();

  @Output()
  dateSelected: EventEmitter<String> = new EventEmitter();

  @Input()
  minDate: number;
  @Input()
  maxDate: number;

  ngOnInit() {

  }

  toggleCalendar() {
    this.isOpen = !this.isOpen;
    this.open.emit(this.isOpen);
  }
  ngAfterViewInit(): void {

  }

  onMonthChanged(my: MonthYear) {
    this.monthChanged.emit({ month: my.month, year: my.year });


  }
  public addAnnotations(annotation: Annotations) {
    this.calendar.addAnnotations(annotation);
  }
  public addHolidays(holidays: Holidays) {
    this.calendar.addHolidays(holidays);
  }
  onDateSelected(date: String) {
    this.dateSelected.emit(date);

  }
}
