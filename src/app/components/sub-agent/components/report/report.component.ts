import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubAgentApiService } from 'src/app/Services/sub-agent-api-services';
import Swal from 'sweetalert2';
import { DatePipe } from "@angular/common"
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  startDate:any;
  today = new Date();
  rtEndDate: any;
  rtStartDate:any;
  rtStartMaxDate:any;
  rtStartMinDate:any;
  rtEndMinDate:any;
  rtEndMaxDate:Date;
  option:any;
  endDate = new Date(this.today.getTime() - 1000 * 60 * 60 * 24);
  month: any;
  years: any[] = [];
  currentOption: boolean = true;
  previousOption: boolean;
  recentReport:boolean = false;
  year: any;
  recentReports: any[];
  mntArray: any[]=[];
  previous:boolean = false;
  current:boolean = true;

  constructor(private apiService:SubAgentApiService,private datepipe:DatePipe) { }

  ngOnInit() {
    this.setMinMaxForReport()
    this.createMonthDropDown()
    this.fetchReport()
  }

  fetchReport(){
    this.apiService.getReport().pipe(takeUntil(this.destroy$)).subscribe((data:any[]) => {
      this.recentReport = true
      this.recentReports = data
    },(error)=>{
      this.recentReport = false
    });
  }


  setMinMaxForReport(){
    this.rtStartDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this.rtEndDate = this.today
    this.rtEndMaxDate = this.today
    this.rtStartMaxDate = this.today
    this.year = new Date().getFullYear()
  }

  startDateChange(){
    this.rtEndMinDate = this.rtStartDate
    this.rtEndMaxDate = new Date(this.rtStartDate.getTime() + 1000 * 60 * 60 * 24 *29);
  }

  endDateChange(){}

  generateReport(){
    if(this.previousOption){
      let body = {
        "current_month": {
        "start_date":"",
        "end_date":""
        },
        "previous_month":{
        "month":this.month,
        "year":this.year
        }, "is_previous_month": "1"
      }
      this.apiService.generateReport(body).pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.showSwal()
      });
      // this.checkForPrevousExistance(this.month,this.year)
      // if(this.mntArray.length > 0){
      //   this.showSwalPrv()
      // }else{
        
      // }
    }
    if(this.currentOption){
      let start_date = this.dateFormater(this.rtStartDate,"yyyy-MM-dd")
      let end_date = this.dateFormater(this.rtEndDate,"yyyy-MM-dd");
      let body = {
        "current_month": {
        "start_date":start_date,
        "end_date":end_date
        },
        "previous_month":{
        "month":"",
        "year":""
        }, "is_previous_month": "0"
      }
      this.apiService.generateReport(body).pipe(takeUntil(this.destroy$)).subscribe((data:any) => {
       if(data.status=='failed'){
        Swal.fire({
          icon: 'error',
          text:data.message[0],
        })
       }else{
        this.showSwal()
       }
      });
   }
  }

  checkForPrevousExistance(mnth,year){
    if(this.recentReports.length > 0){
      this.recentReports.forEach(element => {
        if(element.month == mnth && element.year == year){this.mntArray.push(mnth)}
      });
    }
  }

  showSwal(){
    Swal.fire({
      icon: 'success',
      text: 'We have received your request for the report. Please check your email after few minutes.',
    })
  }
  showSwalPrv(){
    Swal.fire({
      icon: 'success',
      text: 'This report already exist',
    })
  }

  createMonthDropDown(){
    var selectBox = document.getElementById('year');
    for (var i = 2021; i <= 2050; i++) {
      this.years.push(i)
    }
  }

  selectRadio(event){
    if(event.target.value == "current"){
      this.currentOption = true
    }else{
      this.currentOption = false
    }
    if(event.target.value == "previous"){
      this.previousOption = true
    }else{
      this.previousOption = false
    }
  }

  selectOption(item){
    console.log("sdsd",item)
    if(item == "Current"){
      this.currentOption = true
      this.current = true;
    }else{
      this.currentOption = false
      this.current = false;
    }
    if(item == "Previous"){
      this.previousOption = true
      this.previous = true;
    }else{
      this.previousOption = false;
      this.previous = false;
    }
  }

  selectMonth(event){
    this.month = event.target.value
  }

  dateFormater(date: any,format: any) {
    return this.datepipe.transform(date, format);
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
 }
}
