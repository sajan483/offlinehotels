import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild,EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { NotificationService } from 'src/app/common/services/notification.service';
import { SubAgentGeneralHelpers } from 'src/app/components/sub-agent/helpers/general-helpers';
import { TrainSearchService } from 'src/app/components/sub-agent/services/data_service/trainsearch.service';
import { TrainService } from 'src/app/components/sub-agent/services/train.service';

@Component({
  selector: 'app-train-search',
  templateUrl: './train-search.component.html',
  styleUrls: ['./train-search.component.scss']
})
export class TrainSearchComponent implements OnInit {

  enableSearchButton = false;
  isFromActive = false;
  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger, static: false }) selectSourceInput: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger, static: false }) selectDestinationInput: MatAutocompleteTrigger;
  @ViewChild("menuIcon", { read: ElementRef, static: false })
  menuIcon: ElementRef;
  @ViewChild("menuPopup", { read: ElementRef, static: false })
  menuPopup: ElementRef;
  @ViewChild("menuIconTo", { read: ElementRef, static: false })
  menuIconTo: ElementRef;
  @ViewChild("menuPopupTo", { read: ElementRef, static: false })
  menuPopupTo: ElementRef;
  @ViewChild("menuIconClass", { read: ElementRef, static: false })
  menuIconClass: ElementRef;
  @ViewChild("menuPopupClass", { read: ElementRef, static: false })
  menuPopupClass: ElementRef;
  @ViewChild("menuIconClassTrvl", { read: ElementRef, static: false })
  menuIconClassTrvl: ElementRef;
  @ViewChild("menuPopupClassTrvl", { read: ElementRef, static: false })
  menuPopupClassTrvl: ElementRef;
  @ViewChild('returnDatePicker', { read: ElementRef, static: false })
  returnDatePicker: ElementRef;
  stateCtrl = new FormControl();
  stateCtrlD = new FormControl();
  filteredStates: Observable<any>;
  filteredStatesDs: Observable<any>;
  tripType = 'ONE_WAY';
  departureDate: any;
  availableStartDate: any;
  returnDate: any;
  td = new Date();
  today = new Date(this.td.getFullYear(), this.td.getMonth(), this.td.getDate(), 0, 0, 0);
  enableSearchBtn = true;
  fromLocations: any[];
  selectedFromLocation: any;
  toLocations: any[];
  selectedToLocation: any;
  isToActive = false;
  private destroy$ = new Subject();
  displayTabTravel = false;
  countadult = 11;
  countchild = 0;
  countinfa = 0;
  travelClass = 'ECONOMY_CLASS';
  isTravellerActive = false;
  @Input()
  isModify = false;
  @Output()
  onSearch = new EventEmitter();
  private generalHelper : SubAgentGeneralHelpers = new SubAgentGeneralHelpers(this.datepipe);
  searchDataParams:any;

  constructor(private router: Router, private translate: TranslateService, private trainService: TrainService, 
    private renderer2: Renderer2,private notificationService: NotificationService,private activeRoute:ActivatedRoute,
    private trainSearch:TrainSearchService,private datepipe: DatePipe) { }


  ngOnInit() {
    this.renderer2.listen("window", "click", (e: Event) => {
      if (
        !((this.menuPopup && this.menuPopup.nativeElement.contains(e.target)) ||
        (this.menuIcon && this.menuIcon.nativeElement.contains(e.target)))
      ) {
        this.isFromActive = false;
      }
       if (
        !((this.menuPopupTo &&
          this.menuPopupTo.nativeElement.contains(e.target)) ||
        (this.menuIconTo && this.menuIconTo.nativeElement.contains(e.target)))
      ) {
        this.isToActive = false;
      }
       if (
        !((this.menuPopupClass &&
          this.menuPopupClass.nativeElement.contains(e.target)) ||
        (this.menuIconClass &&
          this.menuIconClass.nativeElement.contains(e.target)))
      ) {
        this.displayTabTravel = false;
      }
      if (
        !((this.menuPopupClassTrvl &&
          this.menuPopupClassTrvl.nativeElement.contains(e.target)) ||
        (this.menuIconClassTrvl &&
          this.menuIconClassTrvl.nativeElement.contains(e.target)))
      ) {
        this.isTravellerActive = false;
      }
    });
    
    this.setInitialDatas();
  }

  setInitialDatas(){
    this.searchDataParams = this.activeRoute.snapshot.queryParams;
    this.availableStartDate = this.generalHelper.incrementDate(this.today, 3);
    if(this.searchDataParams.onward_date !== undefined){
      this.departureDate = new Date(this.searchDataParams.onward_date);
    }else{
      this.departureDate = this.generalHelper.incrementDate(this.today,4);
    }
    if(this.searchDataParams.return_date !== undefined){
      this.returnDate = new Date(this.searchDataParams.return_date);
    }else{
      this.returnDate = this.generalHelper.incrementDate(this.departureDate,0);
    }
    if(this.searchDataParams.trip_type !== undefined){
      this.tripType = this.searchDataParams.trip_type;
    }
    if(this.searchDataParams.adults !== undefined){
      this.countadult = +this.searchDataParams.adults;
    }
    if(this.searchDataParams.infants !== undefined){
      this.countinfa = +this.searchDataParams.infants;
    }
    if(this.searchDataParams.children !== undefined){
      this.countchild = +this.searchDataParams.children;
    }
    if(this.searchDataParams.seat_class !== undefined){
      this.travelClass = this.searchDataParams.seat_class;
    }
    this.getFromStations();
  }

  search() {
    let data = {
      "onward_date": this.generalHelper.commonDateFormater(this.departureDate,"yyyy-MM-dd"),
      "return_date": this.generalHelper.commonDateFormater(this.returnDate,"yyyy-MM-dd"),
      "trip_type": this.tripType,
      "departure_station":this.selectedFromLocation.name,
      "arrival_station":this.selectedToLocation.name,
      "departure_code": this.selectedFromLocation.id,
      "arrival_code": this.selectedToLocation.id,
      "adults": this.countadult,
      "infants":this.countinfa,
      "children":this.countchild,
      "seat_class":this.travelClass,
      "ulogId":this.searchDataParams.ulogId,
    }

    this.onSearch.emit(data);
  }

  showFromList(evt) {
    this.isFromActive = !this.isFromActive;
    setTimeout(() => {
      if (this.selectSourceInput) {
        evt.stopPropagation();
        this.selectSourceInput.openPanel();
      }
    }, 100);
  }

  showToList(evt) {
    this.isToActive = !this.isToActive;
    // this.getToStations();\
    setTimeout(() => {
      if (this.selectDestinationInput) {
        evt.stopPropagation();
        this.selectDestinationInput.openPanel();
      }
    });
  }

  setFromLocation(event) {
    this.selectedFromLocation = event;
    this.isFromActive = !this.isFromActive;
    this.getToStations();
  }

  setToLocation(event) {
    this.selectedToLocation = event;
    this.isToActive = !this.isToActive;
  }

  getFromStations() {
    this.trainService.getFromStations().pipe(takeUntil(this.destroy$)).subscribe(
      (data: any) => {
        this.fromLocations = data;
        if(this.searchDataParams.departure_code !== undefined){
          let index = this.fromLocations.findIndex(x => x.id == this.searchDataParams.departure_code);
          if(index != -1){
            this.selectedFromLocation = this.fromLocations[index];
          }else{
            this.selectedFromLocation = this.fromLocations[0];
          }
        }else{
          this.selectedFromLocation = this.fromLocations[0];
        }
        this.filteredStates = this.stateCtrl.valueChanges.pipe(
          startWith(""),
          map((state) => (state ? this.generalHelper._filterFromLocations(state, this.fromLocations) : this.fromLocations.slice()))
        );

        this.getToStations();
      },
      (err) => {
        //this.sharedService.errorMsg();
      });
  }

  getToStations() {
    this.trainService.getToStations(this.selectedFromLocation.id).pipe(takeUntil(this.destroy$)).subscribe(
      (data: any) => {
        this.toLocations = data;

        if(this.searchDataParams.arrival_code !== undefined){
          let index = this.toLocations.findIndex(x => x.id == this.searchDataParams.arrival_code);
          if(index != -1){
            this.selectedToLocation = this.toLocations[index];
          }else{
            this.selectedToLocation = this.toLocations[0];
          }
        }else{
          this.selectedToLocation = this.toLocations[0];
        }

        this.filteredStatesDs = this.stateCtrlD.valueChanges.pipe(
          startWith(""),
          map((state) =>
            state ? this.generalHelper._filterStatesD(state, this.toLocations) : this.toLocations.slice()
          )
        );
        this.search();
      },
      (err) => {
        // this.sharedService.errorMsg();
      }
    );
  }

  onDepartureDateChanged($event) {
    this.returnDatePicker.nativeElement.click();
    // this.returnDate = null;
    // this.returnDate == null ? this.enableSearchBtn = true : this.enableSearchBtn = false;
  }

  onReturnDateChanged($event) {
    this.enableSearchBtn = true;
  }

  travelersB(){
    this.displayTabTravel = !this.displayTabTravel;
  }

  addadult() {
    let t = this.countadult + this.countchild;
    // if(t < 9){
      this.countadult = this.countadult + 1;
    // }else{
    //   this.notificationService.showWarning(this.translate.instant("Travellers Limit Reached"))
    // }
  }



  minusadult() {
    let t = this.countadult;
    if (t > 11) {
      if(this.countadult>0){
        this.countadult = this.countadult - 1;
      }
     }else{
       this.notificationService.showWarning(this.translate.instant("minimum 11 passengers is required"))
     }
  }

  addchild() {

    // if(t < 9){
      this.countchild = this.countchild + 1;
    // }else{
    //   this.notificationService.showWarning(this.translate.instant("Travellers Limit Reached"))
    // }
  }



  minuschild() {
    let t = this.countadult + this.countchild;
    if (t > 11) {
      if(this.countchild>0){
        this.countchild = this.countchild - 1;
      }
     }else{
       this.notificationService.showWarning(this.translate.instant("minimum 11 passengers is required"))
     }
  }

  addinfant() {
      this.countinfa = this.countinfa + 1;
  }



  minusinfant() {
    if(this.countinfa>0)
      this.countinfa = this.countinfa - 1;
    
  }

  taravellerClass(){
    this.isTravellerActive = !this.isTravellerActive;
  }


  onRadioGroupChange(){
    this.returnDate = this.departureDate;
  }

}
