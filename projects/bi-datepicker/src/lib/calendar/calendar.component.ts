import { Component, Input, OnInit, Output, EventEmitter, ViewChildren, QueryList, PLATFORM_ID, Inject, AfterViewInit, ElementRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, NgZone, ChangeDetectorRef, OnDestroy, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import * as momentimp from 'moment';
import { MonthComponent } from '../month/month.component';
import { MonthYear } from '../models/monthyear';
import { Annotations } from '../models/annotations';
import { Holidays } from '../models/holidays';
import { fromEvent, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
const moment = momentimp;
@Component({
    selector: 'bi-calendar',
    styleUrls: ['calendar.component.css'],
    templateUrl: 'calendar.component.html'
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {


    @ViewChildren(MonthComponent)
    cmpMonths: QueryList<MonthComponent>;
    @ViewChild('months', { read: ViewContainerRef, static: false }) private slider: ViewContainerRef;
    @ViewChild('year', { static: false }) private monthParent: ElementRef;

    @Input() months: number = 1;

    @Input() Date: string;

    @Input()
    weekendClass: string = ""

    @Input()
    minDate: number;

    @Input()
    maxDate: number;

    @Input()
    vertical: boolean = false;

    @Input() currency?: string;
    @Input() currencySymbol?: string;

    @Output()
    monthChanged: EventEmitter<MonthYear> = new EventEmitter();

    public month: MonthYear[] = [];
    private annotations: Annotations[];
    private holidays: Holidays[];

    @Output()
    dateSelected: EventEmitter<String> = new EventEmitter();
    date: string;
    difference: number = 0;
    scrollSubscription: Subscription;
    showSelected: boolean = true;

    constructor(private r: ComponentFactoryResolver, private zone: NgZone, @Inject(PLATFORM_ID) private platform: any,
        public cRef: ChangeDetectorRef) { }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platform)) {
            if (this.vertical == true) { this.monthParent.nativeElement.scroll(0, this.slider.element.nativeElement.nextElementSibling.clientHeight * this.difference, { behavior: 'smooth' }); }
            // console.log(this.difference, "this.difference");

        }
    }

    ngOnInit() {
        this.annotations = [];
        this.holidays = [];
        this.initMonths();
        if (this.vertical == true) {
          if(this.Date!=undefined && this.Date.length>0 && this.date!=null){
            this.showSelected = true;
            this.date = this.Date;
            this.difference = moment([parseInt(this.Date.split('-')[2]), parseInt(this.Date.split('-')[1]) - 1]).diff(moment([new Date().getFullYear(), new Date().getMonth()]), 'months', true);
          }else{
            this.showSelected  =false;
            this.date = moment().format('DD-MM-YYYY');
            this.difference = moment([parseInt(this.date.split('-')[2]), parseInt(this.date.split('-')[1]) - 1]).diff(moment([new Date().getFullYear(), new Date().getMonth()]), 'months', true);
          }
            this.difference = Math.floor(this.difference);
            if (this.difference > 0) {
                for (let i = 0; i < this.difference; i++)
                    this.prevMonth(true);
            }
        }
        //this.month = Array[this.months].fill((x,i)=>cMonth++);
        // window.addEventListener('scroll', this.scrollEvent.bind(this), true);
        if (isPlatformBrowser(this.platform)) {
            this.zone.runOutsideAngular(() => {
                this.scrollSubscription = fromEvent(window, 'scroll', { passive: true, capture: true }).pipe(debounceTime(500)).subscribe(e => {
                    this.scrollEvent(e);
                });
            });
        }
    }
    trackByFn(index, item) {
        return item.id;
    }

    private initMonths() {
      this.month = [];
      this.date = this.Date;
      if (typeof (this.Date) == "undefined" || this.Date.length == 0) {
        this.date = moment().format('DD-MM-YYYY');
        this.showSelected = false;
      }else{
        this.showSelected = true;
      }
      let m = this.date.split('-')[1];
        let y = this.date.split('-')[2];
        let cYear: number = parseInt(y);
        let cMonth = moment().set('year', cYear).set('month', parseInt(m) - 1).month() + 1; //parseInt( moment().format('M'));
        for (let i = 0; i < this.months; i++) {
            this.month.push({
                id: cYear + '' + cMonth,
                year: cYear,
                month: cMonth
            } as MonthYear);
            this.monthChanged.emit({
                year: cYear,
                month: cMonth,
                component: this
            } as MonthYear);
            cMonth++;
            if (cMonth > 12) {
                cMonth = 1;
                cYear++;
            }
        }
    }

    prevMonth(status?) {
        let firstMonth: MonthYear = this.month[0];
        let newMonth: MonthYear = { component: this } as MonthYear;

        if (firstMonth.month === new Date().getUTCMonth() + 1 && firstMonth.year === new Date().getUTCFullYear()) { }
        else {
            if (firstMonth.month === 1) {
                newMonth.month = 12;
                newMonth.year = firstMonth.year - 1;
            }
            else {
                newMonth.month = firstMonth.month - 1;
                newMonth.year = firstMonth.year;
            }
            newMonth.id = newMonth.year.toString() + newMonth.month.toString();
            if (status == true) {
                this.month.unshift(newMonth);
            }
            else {
                this.month.pop();
                this.month.unshift(newMonth);
                this.cRef.detectChanges();
                this.monthChanged.emit(newMonth);
            }

        }
    }
    nextMonth() {
        let lastMonth: MonthYear = this.month[this.month.length - 1];
        let newMonth: MonthYear = { component: this } as MonthYear;
        let month = 12 - new Date().getUTCMonth() + 1
        if ((month === 11 && lastMonth.month === 12 && this.month && this.month.length > 12) || (lastMonth.month >= new Date().getUTCMonth() + 1 && lastMonth.year == new Date().getUTCFullYear() + 1)) { }
        else {
            if (lastMonth.month > 11) {
                newMonth.month = 1;
                newMonth.year = lastMonth.year + 1;
            }
            else {
                newMonth.month = lastMonth.month + 1;
                newMonth.year = lastMonth.year;
            }
            if (!this.vertical) {
                this.month.shift();
            }
            newMonth['id'] = newMonth.year + '' + newMonth.month;
            this.month.push(newMonth);
            this.cRef.detectChanges();
            this.monthChanged.emit(newMonth);
        }
    }

    addAnnotations(annotation: Annotations) {

        this.removeAnnotations(annotation.month, annotation.year);
        this.annotations = [
            ...this.annotations,
            annotation
        ];
        this.cmpMonths.map((m) => {
            let hlds = this.annotations.filter(x => x.month == m.month && x.year == m.year);
            if (hlds.length > 0) {
                m.addAnnotations(hlds[0]);
            }
            //     m.holidays = hlds.length > 0 ? hlds[0] : {month:m.month,year:m.year} as Holidays;

        });

        // this.month.map((m)=>{


        //     let ann = this.annotations.filter(x=>x.month==m.month && x.year == m.year);
        //     m.annotation = ann.length > 0 ? ann[0] : {month:m.month,year:m.year} as Annotations;
        // });
    }
    removeAnnotations(month: number, year: number) {

        if (this.annotations) {
            this.annotations = this.annotations.filter((x) => !(x.year == year && x.month == month));
        }
        else {
            this.annotations = [];
        }
    }
    addHolidays(holidays: Holidays) {

        this.removeHolidays(holidays.month, holidays.year);

        this.holidays = [
            ...this.holidays,
            holidays
        ];

        this.cmpMonths.map((m) => {
            let hlds = this.holidays.filter(x => x.month == m.month && x.year == m.year);
            if (hlds.length > 0) {
                m.addHolidays(hlds[0]);
            }
            //     m.holidays = hlds.length > 0 ? hlds[0] : {month:m.month,year:m.year} as Holidays;

        });


        // this.month.map((m)=>{


        //     let hlds = this.holidays.filter(x=>x.month==m.month && x.year == m.year);
        //     m.holidays = hlds.length > 0 ? hlds[0] : {month:m.month,year:m.year} as Holidays;
        // });
        // this.cd.detectChanges();
    }
    removeHolidays(month: number, year: number) {

        if (this.holidays) {
            this.holidays = this.holidays.filter((x) => !(x.year == year && x.month == month));
        }
        else {
            this.holidays = [];
        }
    }
    onDateSelected(date: string) {
        this.dateSelected.emit(date);
        this.date = date;
        this.showSelected = true;
    }
    onDateChanged(date: string){
      this.date = date;
        this.showSelected = true;
    }
    scrollEvent(eve) {
        if (eve.target.className == "monthouter") {
            //if ((eve.target.scrollTop + eve.target.offsetHeight) >= eve.target.scrollHeight) {
            if ((eve.target.scrollTop + (eve.target.offsetHeight * (3))) >= eve.target.scrollHeight) {
                // you're at the bottom of the page
                this.nextMonth();
                this.cRef.detectChanges();
            }
            else if (eve.target.scrollTop == 0) {
                // this.prevMonth(); // COMMENTED TO AVOID SCROLLING OF SELECTED DATES TO BOTTOM OF SCREEN
                this.cRef.detectChanges();
            }
        }
    }

    ngOnDestroy(): void {
        if (this.scrollSubscription) { this.scrollSubscription.unsubscribe() }
    }


    ngOnChanges(changes: SimpleChanges): void {
        const change: SimpleChange = changes.Date || null;
        if (change && change.previousValue) { // if there is a previous change
            if (change.currentValue !== change.previousValue) {
                // this.initMonths();
                this.date = change.currentValue;
                if(change.currentValue!=undefined && change.currentValue !=null && change.currentValue !=""){
                  this.showSelected = true;
                }else{
                  this.showSelected = false;
                }
            }
        }
    }
}





