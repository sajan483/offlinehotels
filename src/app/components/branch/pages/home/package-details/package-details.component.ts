import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchApiService } from 'src/app/Services/branch-api-service';
import Swal from 'sweetalert2';
import { OwlOptions } from "ngx-owl-carousel-o";
import { Annotation, Annotations, CalendarComponent, MonthYear } from 'bi-datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss']
})
export class PackageDetailsComponent implements OnInit {
  itenerary: any;
  availabilityCount: any;
  maxCount: any;
  id: any;
  packageDetails: any;
  branchId: number;
  adultCount: any = 1;
  infantCount: any = 0;
  chindWithoutBedCount: any = 0;
  availability: number;
  shimmer: boolean = true;
  bttnactv: boolean = false;
  countForm: FormGroup;
  currency: any;
  imageshow: number = 0;
  readonly = true;
  minusBttn: boolean = false;
  rating = 5;
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
  imageCollection: any[] = [];
  showBookimgPopup: boolean;
  primaryPackage: any = "";
  singleDayItinerary: any;
  totalAmount: number = 0;
  totalAdltAmount: number = 0;
  totalChdWBAmount: number = 0;
  totalChdWOutBAmount: number = 0;
  totalTravellers: number = 0;
  adult: number = 1;
  childwithoutbed: number = 0;
  child_with_bed: number = 0;
  packageTempDate: any;
  popupPackageDate: any;
  packages: any[];
  @ViewChild('dualCalendar', { static: false }) datePicker: CalendarComponent;
  @ViewChild('popupDatePicker', { static: false }) popUpDatePicker!: CalendarComponent;
  initialSelected = false;
  vertical = false;
  selectedPackage: any;
  isVisaOnly:boolean = false;
  constructor(private branchService: BranchApiService, private activeRouter: ActivatedRoute,
    private route: Router, private fb: FormBuilder) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.countForm = this.fb.group({
      adult: [1, Validators.required],
      childWithBed: [0],
      ChildWithoutBed: [0]
    });
    this.getPackageDetails()
  }

  get continues() {
    if (this.countForm.valid && (this.countForm.controls.adult.value + this.countForm.controls.childWithBed.value + this.countForm.controls.ChildWithoutBed.value) <= this.availabilityCount) {
      return false
    }
    else {
      return true
    }
  }

  get count() { return this.countForm.controls }

  getPackageDetails() {
    this.id = this.activeRouter.params.subscribe(data => {
      this.id = data['id'];
      this.branchService.getB2BMasterPackageDetails(this.id).subscribe((data) => {
        this.currency = data.currency;
        this.setImagecollection(data);
        this.packageDetails = data;
        sessionStorage.setItem("masterPkgData", JSON.stringify(data))
        this.itenerary = data.itinerary_set;
        this.branchId = data.id;
        sessionStorage.setItem("advancePct", data.advance_pct);
        this.getPrimaryPackageDetails(data.primary_package)
      })
    });
  }

  fetchPackageAvailability(id) {
    this.branchService.getPackageAvilability(id).subscribe((data) => {
      this.packages = data;
      this.shimmer = false;
      if (this.packages != undefined && this.packages != null && this.packages.length > 0) {
        this.addAvailability();
      }

    })
  }

  setImagecollection(data) {
    data.image_collections.forEach(element => {
      this.imageCollection.push(element.file)
    });
  }

  getPrimaryPackageDetails(id) {
    this.branchService.getPackageDetails(id).subscribe((data) => {
      this.primaryPackage = data;
      this.singleDayItinerary = this.primaryPackage.master_package.package_itineraries[0]
      this.totalAdltAmount = this.primaryPackage.adult_price
      this.currency = data.currency;
      this.itenerary = data.itinerary_set;
      this.availabilityCount = data.max_passengers - data.booked_count;
      this.availability = this.availabilityCount;
      this.maxCount = data.max_passengers;
      this.branchId = data.id;
      sessionStorage.setItem("advancePct", data.advance_pct);
      this.fetchPackageAvailability(data.id)
      if(!this.primaryPackage.services.flight && !this.primaryPackage.services.hotel && !this.primaryPackage.services.transport && !this.primaryPackage.services.laundry && !this.primaryPackage.services.food && this.primaryPackage.services.visa){
        this.isVisaOnly = true;
      }
    })
  }


  findDuration(a, b) {
    // const date1 = new Date(a);
    // const date2 = new Date(b);
    // const diffTime = Math.abs(date2 - date1);
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //   return noOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  expandItenary(event) {
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

  navigateDaysItenary() {
    document.getElementById("itenaryDay2").scrollIntoView();
  }

  showPopUp() {
    this.showBookimgPopup = true;
  }

  closePopup() {
    this.showBookimgPopup = false;
  }

  adultChange(evnt) {
    this.adult = evnt.target.value
    this.totalAdltAmount = this.primaryPackage.adult_price * evnt.target.value
  }

  childWithOutBedChange(event) {
    this.childwithoutbed = event.target.value
    this.totalChdWOutBAmount = this.primaryPackage.adult_price * event.target.value
  }
  childWithBedChange(event) {
    this.child_with_bed = event.target.value
    this.totalChdWBAmount = this.primaryPackage.adult_price * event.target.value
  }

  callPricingForPackage() {
    if (this.selectedPackage == undefined) {
      Swal.fire({
        text: 'Please select Date',
        icon: "warning",
        confirmButtonText: '0k',
      });
      return;
    } else {
      var totalPax = (+this.countForm.controls.adult.value) + (+this.countForm.controls.childWithBed.value) + (+this.countForm.controls.ChildWithoutBed.value);
      sessionStorage.setItem("packageId", this.selectedPackage.package)
      sessionStorage.setItem("bookPaxCount", totalPax.toString());
      if (totalPax > this.selectedPackage.availability) {
        Swal.fire({
          text: totalPax + ' slot not Available',
          icon: "warning",
          confirmButtonText: '0k',
        });
      } else {
        this.bttnactv = true;
        var body = {
          adults: this.countForm.controls.adult.value,
          infants: 0,
          child_without_bed: this.countForm.controls.ChildWithoutBed.value,
          child_with_bed: this.countForm.controls.childWithBed.value,
          other_services: []
        }
        this.id = this.activeRouter.params.subscribe(data => {
          this.id = data['id'];
          this.branchService.packagePricing(body, this.selectedPackage.package, this.packageDetails.currency).subscribe((data) => {
            sessionStorage.setItem("packagePricingData", JSON.stringify(data))
            this.bttnactv = false;
            this.route.navigate(["/branch/packages/" + this.selectedPackage.package + "/payment"])
          }, (error) => {
            this.bttnactv = false;
          })
        });
      }
    }


  }

  addAvailability() {
    setTimeout(() => {
      let ann: Annotations[] = [] as Annotations[];

      this.packages.forEach(element => {
        let ann1: Annotations = {} as Annotations;
        let date = (element.date.split('T')[0]);
        let dt: Date = new Date(element.date);
        ann1.month = date.split('-')[1];

        ann1.year = date.split('-')[0];
        let i = ann.findIndex((e) => e.month == ann1.month && e.year == ann1.year)
        if (i > -1) {
          let antn: Annotation = {} as Annotation;;
          if (!(ann[i].annotations != undefined && ann[i].annotations != null && ann[i].annotations.length > 0)) {
            ann[i].annotations = [];
          }
          antn.day = dt.getDate().toString();

          antn.text = element.availability;

          antn.highlight = true;
          antn.id = element.package;
          ann[i].annotations.push(antn);
        } else {
          // this.datePicker.removeAnnotations(ann1.month,ann1.year);
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
        ann.forEach((e) => this.datePicker.addAnnotations(e));
      }
      if (this.popUpDatePicker) {
       ann.forEach((e) => this.popUpDatePicker.addAnnotations(e));
      }
      if(this.initialSelected == null || this.initialSelected == undefined || this.initialSelected == false){
        this.initialSelected = true;
        let packageMonth = this.packages[0].date.split('T')[0].split('-')[1];
        let currentdate = new Date().getMonth();
        let currentMnth = currentdate+1;
        while(+packageMonth != currentMnth){
          this.datePicker.nextMonth();
          this.popUpDatePicker.nextMonth();
          if(currentMnth == 12){
            currentMnth = 1
          }else{
            currentMnth = currentMnth + 1;
          }
        }
      }
    }, 10)
  }

  public onDateChanged(event: any) {
    let d: Date = new Date(event.split('-')[2] + "-" + event.split('-')[1] + "-" + event.split('-')[0]);
    let i = this.packages.findIndex((e) => {
      let dt: Date = new Date(e.date);
      return dt.getDate() == d.getDate() && dt.getMonth() == d.getMonth() && dt.getFullYear() == d.getFullYear();
    });

    if (i > -1) {
      this.packageTempDate = moment(this.packages[i].date.split('T')[0]).format('DD-MM-YYYY');
      this.datePicker.onDateChanged(this.packageTempDate)
      this.popUpDatePicker.onDateChanged(this.packageTempDate);
      this.selectedPackage = this.packages[i];
      console.log(this.selectedPackage);
      
      this.showBookimgPopup = true;
    }
    this.addAvailability();
  }

  navigate(){
    if (this.selectedPackage == undefined) {
      Swal.fire({
        text: 'Please select Date',
        icon: "warning",
        confirmButtonText: '0k',
      });
      return;
    }else{
      this.route.navigate(["/branch/packages/" + this.selectedPackage.package + "/payment"])
    }
  }

  monthChanged(event) {
    if (this.packages != undefined && this.packages != null && this.packages.length > 0) {
      this.addAvailability();
    }
  }

  printdiv() {
    window.print();
  }

  navigateBack(){
    this.route.navigate(["/branch/packages"]);
  }
}
