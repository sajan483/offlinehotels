import { DatePipe } from "@angular/common";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/common/services/notification.service';
import {FlightServices} from '../services/flight-api-services';
import {  Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import { SubAgentModule } from "../../../module/sub-agent.module";


@Injectable({
  providedIn: SubAgentModule
})
export class FlightHelper {
  datepipe: DatePipe;
  private destroy$ = new Subject();
  translate: TranslateService;
  notificationService: NotificationService;
  flightService: FlightServices;
  constructor(private _notificationService: NotificationService,
    private _translate: TranslateService,
    private _datepipe: DatePipe,
    public _flightService: FlightServices,
    private router : Router) {
      this.notificationService = _notificationService
      this.datepipe = _datepipe
      this.translate = _translate
      this.flightService = _flightService
    }

    incrementDate(date,days) {
      let d = new Date(date);
      d.setDate(d.getDate() + days);
      return d;
    }
    dateFormater2(date: any) {
      let latest_date = this.datepipe.transform(date, "yyyy-MM-dd");
      return latest_date;
    }
    commonDateFormater(date: any,format:string) {
      let latest_date = this.datepipe.transform(date,format);
      return latest_date;
    }
    stageArraySet(value:number){
      let array:any[] =  JSON.parse(sessionStorage.getItem('stageArray'))
      const index = array.indexOf(value, 0);
      if(index == -1){
        array.push(value);
        array.sort();
        sessionStorage.setItem('stageArray',JSON.stringify(array))
      }
    }

    airportfilterStatesD(value: string,statesD): any[] {
      const filterValue = value.toLowerCase();

      return statesD.filter(
        (state) => state.city.toLowerCase().indexOf(filterValue) === 0
      );
    }

    /* */
    airportfilterStates(value: string,selectedLanguage): any[] {
      const filterValue = value.toLowerCase();

     let states = [];
      this.flightService.getAirportList(value,selectedLanguage).pipe(takeUntil(this.destroy$)).subscribe(
        (data) => {
        for (const d of data as any) {
          states.push(d);
        }
        },
        (err) => {
         // this.sharedService.errorMsg();
        });

      return states;
    }

    hasValidDates(ddate,returnDate){
      if(typeof(ddate) == 'undefined'){
        this.notificationService.showWarning(this.translate.instant('Departure Date Required'))
        return false;
      }
      if(typeof(returnDate) == 'undefined'){
        this.notificationService.showWarning(this.translate.instant('Return Date Required'))
        return false;
      }

      return true;
    }

    dateFormater(date: any) {
      let latest_date = this.datepipe.transform(date, "MM/dd/yyyy");
      return latest_date;
    }
    _filterStates(value: string,selectedLanguage): any[] {
      const filterValue = value.toLowerCase();
      console.log("ayman",filterValue);
     let states = [];
      this.flightService.getAirportList(value,selectedLanguage).pipe(takeUntil(this.destroy$)).subscribe(
        (data) => {
        for (const d of data as any) {
          states.push(d);
        }
        },
        (err) => {
         // this.sharedService.errorMsg();
        });

      return states;
    }

    get_cabin_class_code(cabin_class){
      let cabin = '';
      if(cabin_class == 'Economy'){
        cabin = 'E';
      }else if(cabin_class == 'Business'){
        cabin = 'B';
      }else if(cabin_class == 'First Class'){
        cabin = 'F';
      }else if(cabin_class == 'Premium Economy'){
        cabin = 'PE';
      }
      return cabin;
    }
    get_cabin_class_name(cabin_class_code){
      let cabin = '';
      if(cabin_class_code == 'E'){
        cabin = 'Economy';
      }else if(cabin_class_code == 'B'){
        cabin = 'Business';
      }else if(cabin_class_code == 'F'){
        cabin = 'First Class';
      }else if(cabin_class_code == 'PE'){
        cabin = 'Premium Economy';
      }
      return cabin;
    }



}







