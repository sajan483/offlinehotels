import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { Annotation, Annotations, CalendarComponent } from 'bi-datepicker';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.scss']
})
export class ManageBookingsComponent implements OnInit,OnDestroy{
  id:any;
  private destroy$ = new Subject();
  masterData: any;
  @ViewChild('dualCalendar', { static: false }) datePicker: CalendarComponent;
  @ViewChild('dualCalendarDays', { static: false }) dateWisePicker: CalendarComponent;
  @ViewChild('availabiltyClndr', { static: false }) AvailabilityPicker: CalendarComponent;
  packages: any;
  selectedPackage:any;
  availabilityCount:any;
  packageTempDate: any;
  dateRangeArray:any[]=[];
  minDate = new Date();
  dateRange:any;
  bttnactive: boolean;
  master_id: any;
  bookings: any[] = [];
  currentPage:number = 1;
  totalPage:number = 0;
  masterPackageList:boolean = true;
  shimmer:boolean = false;
  checked: boolean;
  bttnActive: boolean;
  initialSelectedBookings: boolean = false;
  initialSelectedDayWise: boolean = false;
  initialSelectedAvailability: boolean = false;

  constructor(private apiService:SuperAgentApiService,private activeRouter:ActivatedRoute,public datepipe:DatePipe,private route:Router) { }

  ngOnInit() {
    this.getDetails()
  }

  getAllBookings(page){
    this.masterPackageList = true;
    this.shimmer = true;
    this.apiService.getMasterPackageBookings(this.master_id,page).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.shimmer = false;
      if(data.total > 0){
        this.bookings = data.results;
        this.totalPage = data.total_pages;
      }
    })
  }

  paginate(event) {
    if(event>=1 && event<=this.totalPage){
      this.currentPage = event;
      if(this.masterPackageList){
        this.getAllBookings(this.currentPage);
      }else{
        this.packageBookings(this.currentPage)
      }
      
    }
  }

  getDetails(){
    this.id = this.activeRouter.params.subscribe(data=>{
      this.id = data['id'];
      this.apiService.getMasterPackageById(this.id).pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
        this.masterData = data;
        this.master_id = data.id;
        this.getAllBookings(this.currentPage)
        this.packageAvailability(data.primary_package)
      })
    })
  }

  packageAvailability(id){
    this.apiService.getPackageAvilability(id).pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.packages = data;
        if(this.packages!=undefined && this.packages!=null && this.packages.length>0){
          this.addAvailability();
          this.addBookings();
          this.addMaxSlotes()
        }
    })
  }

  addBookings(){
    setTimeout(() => {
      let ann: Annotations[] = [] as Annotations[];

    this.packages.forEach(element => {
      let ann1: Annotations = {} as Annotations;
      let date  = (element.date.split('T')[0]);
      let dt:Date = new Date(element.date);
      ann1.month = date.split('-')[1];

      ann1.year = date.split('-')[0];
      let i = ann.findIndex((e)=>e.month == ann1.month && e.year == ann1.year)
      if(i>-1){
        let antn: Annotation = {} as Annotation;;
        if(!(ann[i].annotations!=undefined && ann[i].annotations!=null && ann[i].annotations.length>0)){
          ann[i].annotations = [];
        }
        antn.day = dt.getDate().toString();

        antn.text = element.booked_count;

        antn.highlight= true;
        antn.id = element.package;
        ann[i].annotations.push(antn);
      }else{
        ann1.annotations = [];
        let antn: Annotation = {} as Annotation;;
        antn.day = dt.getDate().toString();
        antn.text = element.booked_count;
        antn.id = element.package;
        antn.highlight = true;
        ann1.annotations.push(antn);
        ann.push(ann1);
      }

    });
    if (this.datePicker) {
      ann.forEach((e)=>this.datePicker.addAnnotations(e));
    }

    if(this.initialSelectedBookings == null || this.initialSelectedBookings == undefined || this.initialSelectedBookings == false){
      this.initialSelectedBookings = true;
      let packageMonth = this.packages[0].date.split('T')[0].split('-')[1];
      let currentdate = new Date().getMonth();
      let currentMnth = currentdate+1;
      if(+packageMonth != currentMnth){
        for(var i=currentMnth;i<(+packageMonth);i++){
          this.datePicker.nextMonth();
        }
      }
    }
    
    },10)
  }

  public onDateChanged(event:any){
    let d:Date  = new Date(event.split('-')[2] + "-" + event.split('-')[1] + "-" + event.split('-')[0]);
    let i = this.packages.findIndex((e)=>{
      let dt:Date = new Date(e.date);
      return dt.getDate() == d.getDate() && dt.getMonth() == d.getMonth() && dt.getFullYear() == d.getFullYear();
    });

    if(i>-1){
        this.selectedPackage = this.packages[i];
        this.packageBookingCall()
        this.availabilityCount = this.selectedPackage.availability;
        this.packageTempDate = moment(this.packages[i].date.split('T')[0]).format('DD-MM-YYYY');
    }
    this.addBookings();

  }

  monthChangedBookings(event) {
    if (this.packages != undefined && this.packages != null && this.packages.length > 0) {
      this.addBookings();
    }
  }

  addMaxSlotes(){
    setTimeout(() => {
      let ann: Annotations[] = [] as Annotations[];

    this.packages.forEach(element => {
      let ann1: Annotations = {} as Annotations;
      let date  = (element.date.split('T')[0]);
      let dt:Date = new Date(element.date);
      ann1.month = date.split('-')[1];

      ann1.year = date.split('-')[0];
      let i = ann.findIndex((e)=>e.month == ann1.month && e.year == ann1.year)
      if(i>-1){
        let antn: Annotation = {} as Annotation;;
        if(!(ann[i].annotations!=undefined && ann[i].annotations!=null && ann[i].annotations.length>0)){
          ann[i].annotations = [];
        }
        antn.day = dt.getDate().toString();

        antn.text = element.max_passengers;

        antn.highlight= true;
        antn.id = element.package;
        ann[i].annotations.push(antn);
      }else{
        ann1.annotations = [];
        let antn: Annotation = {} as Annotation;;
        antn.day = dt.getDate().toString();
        antn.text = element.max_passengers;
        antn.id = element.package;
        antn.highlight = true;
        ann1.annotations.push(antn);
        ann.push(ann1);
      }

    });
    if (this.dateWisePicker) {
      ann.forEach((e)=>this.dateWisePicker.addAnnotations(e));
    }

    if(this.initialSelectedDayWise == null || this.initialSelectedDayWise == undefined || this.initialSelectedDayWise == false){
      this.initialSelectedDayWise = true;
      let packageMonth = this.packages[0].date.split('T')[0].split('-')[1];
      let currentdate = new Date().getMonth();
      let currentMnth = currentdate+1;
      if(+packageMonth != currentMnth){
        for(var i=currentMnth;i<(+packageMonth);i++){
          this.dateWisePicker.nextMonth();
        }
      }
    }
    
    },10)
  }

  public onDateWiseChanged(event:any){
    let d:Date  = new Date(event.split('-')[2] + "-" + event.split('-')[1] + "-" + event.split('-')[0]);
    let i = this.packages.findIndex((e)=>{
      let dt:Date = new Date(e.date);
      return dt.getDate() == d.getDate() && dt.getMonth() == d.getMonth() && dt.getFullYear() == d.getFullYear();
    });

    if(i>-1){
        this.selectedPackage = this.packages[i];
        this.checked = this.selectedPackage.active;
        (<HTMLElement>document.getElementById("openPopup")).click();
        this.availabilityCount = this.selectedPackage.availability;
        this.packageTempDate = moment(this.packages[i].date.split('T')[0]).format('DD-MM-YYYY');
    }
    this.addMaxSlotes();
  }

  monthChangedMaxSlot(event) {
    if (this.packages != undefined && this.packages != null && this.packages.length > 0) {
      this.addMaxSlotes();
    }
  }

  

  addAvailability(){
    setTimeout(() => {
      let ann: Annotations[] = [] as Annotations[];

    this.packages.forEach(element => {
      let ann1: Annotations = {} as Annotations;
      let date  = (element.date.split('T')[0]);
      let dt:Date = new Date(element.date);
      ann1.month = date.split('-')[1];

      ann1.year = date.split('-')[0];
      let i = ann.findIndex((e)=>e.month == ann1.month && e.year == ann1.year)
      if(i>-1){
        let antn: Annotation = {} as Annotation;;
        if(!(ann[i].annotations!=undefined && ann[i].annotations!=null && ann[i].annotations.length>0)){
          ann[i].annotations = [];
        }
        antn.day = dt.getDate().toString();

        antn.text = element.availability;

        antn.highlight= true;
        antn.id = element.package;
        ann[i].annotations.push(antn);
      }else{
        ann1.annotations = [];
        let antn: Annotation = {} as Annotation;;
        antn.day = dt.getDate().toString();
        antn.text = element.availability;
        antn.id = element.package;
        antn.highlight = true;
        ann1.annotations.push(antn);
        ann.push(ann1);
      }

    });
    if (this.AvailabilityPicker) {
      ann.forEach((e)=>this.AvailabilityPicker.addAnnotations(e));
    }

    if(this.initialSelectedAvailability == null || this.initialSelectedAvailability == undefined || this.initialSelectedAvailability == false){
      this.initialSelectedAvailability = true;
      let packageMonth = this.packages[0].date.split('T')[0].split('-')[1];
      let currentdate = new Date().getMonth();
      let currentMnth = currentdate+1;
      if(+packageMonth != currentMnth){
        for(var i=currentMnth;i<(+packageMonth);i++){
          this.AvailabilityPicker.nextMonth();
        }
      }
    }
    
    },10)
  }

  public onDateAvailibility(event:any){
    let d:Date  = new Date(event.split('-')[2] + "-" + event.split('-')[1] + "-" + event.split('-')[0]);
    let i = this.packages.findIndex((e)=>{
      let dt:Date = new Date(e.date);
      return dt.getDate() == d.getDate() && dt.getMonth() == d.getMonth() && dt.getFullYear() == d.getFullYear();
    });

    if(i>-1){
        this.selectedPackage = this.packages[i];
        this.availabilityCount = this.selectedPackage.availability;
        this.packageTempDate = moment(this.packages[i].date.split('T')[0]).format('DD-MM-YYYY');
    }
    this.addAvailability();
  }

  monthChangedAvailability(event) {
    if (this.packages != undefined && this.packages != null && this.packages.length > 0) {
      this.addAvailability();
    }
  }

  packageBookingCall(){
    this.currentPage = 1;
    this.totalPage = 0;
    this.bookings = [];
    this.masterPackageList = false;
    this.packageBookings(this.currentPage)
  }

  packageBookings(page){
    this.shimmer = true;
    this.apiService.getPackageBookings(this.selectedPackage.package,page).pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.shimmer = false;
      if(data.total > 0){
        this.bookings = data.results;
        this.totalPage = data.total_pages;
      }
    })
  }

  addRange(){
    var date = {
      start_date: this.dateFormater(this.dateRange[0]),
      end_date: this.dateFormater(this.dateRange[1])
    }
    this.dateRangeArray.push(date);
    sessionStorage.setItem('dateRangeArray',JSON.stringify(this.dateRangeArray))
  }

  dateFormater(date: any) {
    let latest_date = this.datepipe.transform(date, "dd-MM-yyyy");
    return latest_date;
  }

  removeRange(i){
    this.dateRangeArray.splice(i,1);
    sessionStorage.setItem('dateRangeArray',JSON.stringify(this.dateRangeArray))
  }

  availabilityAdd(){
    this.bttnactive = true;
    var body={
      date_ranges:this.dateRangeArray
    }
    this.apiService.availabilityAdd(body,this.masterData.primary_package).pipe(takeUntil(this.destroy$)).subscribe(data =>{
      this.bttnactive = false;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Update succesfully',
        showConfirmButton: false,
        timer: 1500
      })
      this.packageAvailability(this.masterData.primary_package);
    })
  }

  showBooking(id){
    this.route.navigateByUrl('superagent/package/'+id+'/bookings-details')
  }

  convert(){
    this.checked = !this.checked
  }

  deactivatePackage(){
    var body ={
      "active":this.checked
    }
    this.bttnActive = true;
    this.apiService.deactivePackage(body,this.selectedPackage.package).pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.bttnActive = false;
      (<HTMLElement>document.getElementById("closePopUp")).click();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Update succesfully',
        showConfirmButton: false,
        timer: 1500
      })
      this.packageAvailability(this.masterData.primary_package);
    })
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  }

}