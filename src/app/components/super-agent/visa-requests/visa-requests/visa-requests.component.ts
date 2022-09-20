import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { takeUntil } from 'rxjs/operators';
import { Annotation, Annotations, CalendarComponent } from 'bi-datepicker';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-visa-requests',
  templateUrl: './visa-requests.component.html',
  styleUrls: ['./visa-requests.component.scss']
})
export class VisaRequestsComponent implements OnInit {
  id:any;
  private destroy$ = new Subject();
  masterData: any;
  packages: any;
  @ViewChild('dualCalendar', { static: false }) datePicker: CalendarComponent;
  initialSelectedBookings: boolean = false;
  selectedPackage:any = null;
  availabilityCount:any;
  packageTempDate: any;
  bookingDatePicker:boolean=false;
  visaRequests: any[] = [];
  currentPage:number = 1;
  totalPage:number = 0;
  shimmer: boolean = true;
  visaToggle:boolean = false;

  constructor(private activeRouter:ActivatedRoute,private apiService:SuperAgentApiService,private cd:ChangeDetectorRef,
    private router:Router) { }

  ngOnInit() {
    this.getDetails()
  }

  getDetails(){
    this.id = this.activeRouter.params.subscribe(data=>{
      this.id = data['id'];
      this.apiService.getMasterPackageById(this.id).pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
        this.masterData = data;
        this.packageAvailability(data.primary_package);
      })
    })
  }

  packageAvailability(id){
    this.apiService.getPackageAvilability(id).pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.packages = data;
      console.log(this.packages.length);
      if(this.packages.length > 0){
        this.bookingDatePicker = true;
        this.addBookings();
      }else{
        Swal.fire({
          title: 'Empty Bookings.',
          text: "No bookings in this package!",
          icon: 'warning',
        }).then((result) => {
          this.router.navigate(['/superagent/view_package'])
        })
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
        this.availabilityCount = this.selectedPackage.availability;
        this.packageBookingList(1)
        this.packageTempDate = moment(this.packages[i].date.split('T')[0]).format('DD-MM-YYYY');
    }
    this.addBookings();

  }

  monthChangedBookings(event) {
    if (this.packages != undefined && this.packages != null && this.packages.length > 0) {
      this.addBookings();
    }
  }

  packageBookingList(page){
    this.shimmer = true;
    this.bookingDatePicker = false;
    this.apiService.getVisaList(this.selectedPackage.package,page).pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
      this.shimmer = false;
      this.visaRequests = data.results;
      this.totalPage = data.total_pages;
      this.currentPage = data.page;
      this.cd.detectChanges();
    })
  }

  openPopUp(){
    this.bookingDatePicker = true;
  }

  downloadData(){
    this.visaToggle = true;
    this.apiService.downloadVisaData(this.selectedPackage.package).pipe(takeUntil(this.destroy$)).subscribe((response) =>{
      this.downloadVisaRar(response.body)
    })
  }

  downloadVisaRar(blob) {
    var newBlob = new Blob([blob], { type: blob.type })
    const data = window.URL.createObjectURL(newBlob);
    console.log(data)
    var link = document.createElement('a');
    link.href = data;
    link.click();
    this.visaToggle = false;
  }

}
