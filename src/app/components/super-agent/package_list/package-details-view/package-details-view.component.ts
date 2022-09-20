import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { Annotation, Annotations, CalendarComponent } from 'bi-datepicker';
import * as moment from 'moment';
import { OwlOptions } from "ngx-owl-carousel-o";
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-package-details-view',
  templateUrl: './package-details-view.component.html',
  styleUrls: ['./package-details-view.component.scss']
})
export class PackageDetailsViewComponent implements OnInit {
  availabilityCount:any;
  private destroy$ = new Subject();
  id:any;
  masterPackage: any;
  availability: number;
  shimmer:boolean = true;
  currency: any;
  imageshow:number = 0;
  readonly = true;
  minusBttn :boolean = false;
  rating=5;
  packageImageOption: OwlOptions = {
    loop: true,
    autoWidth: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ["&#8249;", "&#8250;"],
    responsive: {
      0: {
        items: 3,
      },
      400: {
        items: 4,
      },
      740: {
        items: 6,
      },
      940: {
        items: 10,
      },
    },
    nav: true,
  };
  imageCollection:any[] = [];
  showBookimgPopup: boolean;
  primaryPackage: any = "";
  packageTempDate: any;
  packages : any[];
  @ViewChild('dualCalendar', { static: false }) datePicker: CalendarComponent;
  @ViewChild('popupDatePicker', { static: false }) popUpDatePicker!: CalendarComponent;

  vertical = false;
  selectedPackage:any;

  constructor(private apiService:SuperAgentApiService,private activeRouter:ActivatedRoute) { }

  ngOnInit() {
    this.getMasterDetails()
  }

  getMasterDetails(){
    this.shimmer =true;
    this.id = this.activeRouter.params.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.id = data['id'];
      this.apiService.getPackageDetails(this.id).pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
        this.primaryPackage = data;
        this.masterPackage = data.master_package;
        this.currency = data.master_package.currency;
        this.fetchPackageAvailability(data.id);
        this.setImagecollection(data.master_package)
      })
    })
  }

  monthChangedAvailability(event) {
    if (this.packages != undefined && this.packages != null && this.packages.length > 0) {
      this.addAvailability();
    }
  }

  fetchPackageAvailability(id){
    this.apiService.getPackageAvilability(id).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.packages = data;
      this.shimmer =false;
        if(this.packages!=undefined && this.packages!=null && this.packages.length>0){
          this.addAvailability();
        }

    })
  }

  setImagecollection(data){
    data.image_collections.forEach(element => {
      if(element.webpfile != null){
        this.imageCollection.push(element.webpfile)
      }else{
        this.imageCollection.push(element.file)
      }
      
    });
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
    if (this.datePicker) {
      ann.forEach((e)=>this.datePicker.addAnnotations(e));
    }
    if(this.popUpDatePicker){
      ann.forEach((e)=>this.popUpDatePicker.addAnnotations(e));
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
        this.packageTempDate = moment(this.packages[i].date.split('T')[0]).format('DD-MM-YYYY');
    }
    this.addAvailability();

  }

  printdiv(){
    window.print();
  }

  expandItenary(event){
    var panel = event.target.previousElementSibling;
    if (panel.style.maxHeight) {
      this.minusBttn = false;
      panel.style.maxHeight = null;
    } else {
      this.minusBttn = true;
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

  backImage() {
    if (this.imageshow > 0) {
      this.imageshow--;
    }
  }

  forwardImage() {
    if (this.imageshow < (this.imageCollection.length - 1)) {
      this.imageshow++;
    }
  }
  
  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  } 
  
}
