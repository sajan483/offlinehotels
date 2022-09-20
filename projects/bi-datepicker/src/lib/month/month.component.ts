import { Component, Input, OnInit, AfterViewInit, ViewChildren, QueryList, Output, EventEmitter, NgZone, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { Day } from '../models/day';
import * as momentimp from 'moment';
import { WeekComponent } from '../week/week.component';
import { Annotations } from '../models/annotations';
import { Holidays } from '../models/holidays';
import { Holiday } from '../models/holiday';
import { Annotation } from '../models/annotation';
import { BiDatepickerService } from '../bi-datepicker.service';


const moment = momentimp;


@Component({
    selector: 'bi-month',
    styleUrls: ['month.component.css'],
    templateUrl: 'month.component.html'
})
export class MonthComponent implements OnInit, AfterViewInit, OnChanges {
    ngOnChanges(changes: SimpleChanges) {
        this.generateWeeks();
    }

    constructor(private zone: NgZone, private ref: ChangeDetectorRef, private service: BiDatepickerService) {
    }

    @ViewChildren(WeekComponent)
    cmpWeeks: QueryList<WeekComponent>;
    @Input()  showSelected:boolean = true;
    @Input() Date: String;
    @Input() month: number;
    @Input() year: number;
    @Input() weekendClass: string = "";
    @Input() inActiveClass: string = "";
    @Input() minDate: number;
    @Input() maxDate: number;
    @Input() vertical: boolean;
    @Input() currency?: string;
    @Input() currencySymbol?: string;
    @Output()
    dateSelected: EventEmitter<String> = new EventEmitter();

    ngOnInit(): void {
        this.generateWeeks();
    }
    ngAfterViewInit(): void {

    }
    public weeks: Day[][] = [];
    public monthName: string = "";
    weekWithId = [];


    //@Input()
    annotation: Annotations;
    // @Input()
    holidays: Holidays;

    addHolidays(hld: Holidays) {
        this.holidays = hld;
        let hlds: Holiday[] = [];
        if (this.holidays && this.holidays.holidays) {
            if (this.holidays.holidays.length > 0) {
                this.cmpWeeks.forEach((d) => {
                    let h: Holiday[] = this.holidays.holidays.filter((x) => d.week.filter((w) => parseInt(w.day) === parseInt(x.day)).length > 0);
                    if (h.length > 0) {
                        d.addHolidays(h);
                        //hlds.push(h[0]);
                    }
                })
            }
        }
        this.ref.detectChanges();
        //return hlds;
    }

    addAnnotations(ann: Annotations) {

        this.annotation = ann;
        let anns: Annotation[] = [];
        if (this.annotation && this.annotation.annotations) {
            if (this.annotation.annotations.length > 0) {
                this.cmpWeeks.forEach((d) => {
                    let h: Annotation[] = this.annotation.annotations.filter((x) => d.week.filter((w) => w.day === x.day).length > 0);
                    if (h.length > 0) {
                        d.addAnnotation(h);
                        //hlds.push(h[0]);
                    }
                    //d['runtime'] = 'thenga';
                })
            }
            //console.log(this.cmpWeeks)
        }
        //return hlds;
    }




    private generateWeeks() {
        // console.log('generating weeks', this.month);
        let cal = moment().year(this.year).month(this.month - 1).startOf('month');
        let startDay: number = parseInt(cal.format('d'), 10);
        let endDay: number = cal.daysInMonth();
        this.monthName = cal.format('MMMM');
        var prevEndDay = cal.subtract(1, "month").daysInMonth();

        let weekdays: Day[][] = [];
        let monthCache: Day[][] = this.service.getMonth(cal.format("YYYYMM"));
        if (monthCache == null) {

            weekdays.push([]);
            let dateIn: string[] = this.Date.split('-');
            let dmIn: number = parseInt(dateIn[1]);
            let dyIn: number = parseInt(dateIn[2]);
            let ddIn: number = parseInt(dateIn[0]);
            let c1: number = 1;
            // Previous Month filling in current month
            for (let i = prevEndDay - startDay + 1, j = startDay; j > 0; i++, j--) {
                weekdays[0].push({
                    id: this.year.toString() + this.month.toString() + i.toString(),
                    day: i.toString(),
                    month: this.month.toString(),
                    year: this.year.toString(),
                    isCurrentMonth: false,
                    isActive: false,
                    isSelected:this.showSelected && ( (this.month == dmIn && this.year == dyIn && ddIn == (c1 - 1))),
                    isWeekend: weekdays[0].length == 0 ? true : false, //|| this.weeks[0].length==6
                    isHoliday: false,
                    toolTip: '',
                } as Day);
                // console.log(weekdays, "weekdays");
            }

            let c: number = 1;
            let cdate = moment().startOf('day');
            //current month after previous month;
            for (let i = startDay; i < 7; i++) {

                cal = cal.year(this.year).month(this.month - 1).date(c).startOf('day');


                let act:boolean = true, act1: boolean = true;
                if (typeof (this.minDate) != "undefined") {
                    act = cal.diff(cdate, 'days') >= this.minDate;
                }
                if (typeof (this.maxDate) != "undefined") {
                    act1 = cal.diff(cdate, 'days') <= this.maxDate;
                }

                    weekdays[0].push({
                        id: this.year.toString() + this.month.toString() + c.toString(),
                        day: (c++).toString(),
                        isCurrentMonth: true,
                        isActive: act && act1,
                        month: this.month.toString(),
                        year: this.year.toString(),
                        isWeekend: weekdays[0].length == 0 ? true : false,//|| this.weeks[0].length==6
                        isSelected: this.showSelected && ((this.month == dmIn && this.year == dyIn && ddIn == (c - 1))),
                    } as Day);
            }
            let cm = true;
            for (let i = 1; i < 6; i++) {


                weekdays.push([]);
                for (let j = 0; j < 7; j++) {
                    cal = cal.year(this.year).month(this.month - 1).date(c).startOf('day');
                    let act:boolean =true, act1: boolean = true;
                    if (typeof (this.minDate) != "undefined") {
                        act = cal.diff(cdate, 'days') >= this.minDate;

                    }
                    if (typeof (this.maxDate) != "undefined") {
                        act1 = cal.diff(cdate, 'days') <= this.maxDate;


                    }
                        weekdays[weekdays.length - 1].push(
                            {
                                id: this.year.toString() + this.month.toString() + c.toString(),
                                day: (c++).toString(),
                                isCurrentMonth: cm,
                                isActive: act && act1 && cm,
                                month: this.month.toString(),
                                year: this.year.toString(),
                                isWeekend: weekdays[weekdays.length - 1].length == 0 ? true : false, //|| this.weeks[this.weeks.length - 1].length==6 for saturday
                                isSelected: this.showSelected && ((this.month == dmIn && this.year == dyIn && ddIn == (c - 1) && cm === true)),
                                //isInBetween: moment(this.year + '-' + this.month + '-' + (c - 1)).isBetween(dyIn + '-' + dmIn + '-' + ddIn, dyOut + '-' + dmOut + '-' + ddOut)
                                //isInBetween: (this.month ==dmIn && this.year == dyIn && ddIn < (c-1) && cm === true ) && (this.month == dmOut && this.year == dyOut && ddOut > (c-1) && cm === true)
                            } as Day
                        );

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

        this.weekWithId = weekdays.map((w, index) => {
            return {
                id: this.year.toString() + this.month.toString() + index.toString(),
                weekdays: w
            }
        });
    }

    trackByFn(index, item) {
        return item.id;
    }
    onDateSelected(date: String) {
        this.dateSelected.emit(date);

    }
}

