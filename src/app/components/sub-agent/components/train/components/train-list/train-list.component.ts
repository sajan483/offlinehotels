import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TrainSearchService } from 'src/app/components/sub-agent/services/data_service/trainsearch.service';
import { TrainService } from 'src/app/components/sub-agent/services/train.service';
import { NotificationService } from 'src/app/common/services/notification.service';
import { UserStateService } from 'src/app/components/sub-agent/services/User-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-train-list',
  templateUrl: './train-list.component.html',
  styleUrls: ['./train-list.component.scss']
})
export class TrainListComponent implements OnInit {
  @Input() onWardEdit:boolean;
  @Input() returnEdit:boolean;
  searchCount = 0;
  trainListTimer: any;
  @Input() hasReturn = false;
  @Input() trainList: any;
  selectedOnwardTrain: any;
  selectedReturnTrain: any;
  totalFare = 0;
  @Input() currency = 'SAR';
  showSuccessModal = false;
  acceptTerms = false;
  getCountryCode: any = '91';
  nationalityList: any;
  phoneNumber = '';
  email = '';
  invalidEmail: boolean = false;
  callingVerification: boolean = false;
  contactValidation: boolean = false;
  phnCntryCode: string = "";
  userEmail = '';
  currentUserPhoneNumber = '';
  invalidPhone = false;
  phoneNumberValidation = true;
  verificationLoading = false;
  disableBookAndContinueBtn = true;
  bookContinueBttn = true;
  expireTime: boolean = true;
  utNo = '';
  @Input()
  showFare = false;
  isMobile = false;
  phoneInputObj;
  @ViewChild('phoneInput', { read: ElementRef, static: false })
  phoneInput: ElementRef;
  lat;
  lng;
  user: any;
  isTermsActive = false;
  emailFocused = false;
  phoneFocused = false;
  @Input() language = '';
  trainForm: FormGroup;
  submitted = false;
  @Input() searchData:any;
  @Input() searchId:any;

  constructor(private trainSearch: TrainSearchService,
    private trainService: TrainService,
    private translate: TranslateService,
    private router: Router, 
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    private userState:UserStateService) {

  }

  ngOnInit() {

    this.initialCall();
    this.callNan();
   
    this.userState.isTermsRailActive.subscribe((data)=>{
      this.isTermsActive = data;
    })
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);

    this.isMobile = check;
  }

  initialCall(){
    this.trainForm = this.formBuilder.group({
      phone_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() { return this.trainForm.controls; }

  onWardEditToggle(train) {
    if (train) {
      if(this.hasReturn){
        this.returnTrainDisable(train);
      }
      this.selectedOnwardTrain = train;
      this.selectedReturnTrain = null;
      this.returnEdit = false;
      this.onWardEdit = true;
    } else {
      this.selectedOnwardTrain = null;
      this.selectedReturnTrain = null;
      this.returnEdit = false;
      this.onWardEdit = false;
    }
    this.calculateTotal();
  }

  returnTrainDisable(train) {
    if(this.trainList.onward_date == this.trainList.return_date){
      let onwrdHvr = +train['Arrival time'].split(':')[0];
      onwrdHvr = onwrdHvr + 1;
      let onwrdMin = +train['Arrival time'].split(':')[1];
      this.trainList.return.forEach(x => {
        x.disable = false;
        let returnHvr = +x['Departure time'].split(':')[0];
        let returnMin = +x['Departure time'].split(':')[1];
        if (returnHvr < onwrdHvr) {
          x.disable = true;
        } else if(onwrdHvr == 1){
          x.disable = true;
        } else if (returnHvr == onwrdHvr) {
          if (returnMin < onwrdMin) {
            x.disable = true;
          }
        }
      });
    }
  }

  returnEditToggle(train) {
    if (this.selectedOnwardTrain) {

      if (train) {
        if (train.selectedClass == this.selectedOnwardTrain.selectedClass) {
          this.selectedReturnTrain = train;
          this.returnEdit = !this.returnEdit;
          this.calculateTotal();
        }
        else {
          this.notification.showWarning(this.translate.instant("Please choose the same class as onward"));
        }
      } else {
        this.selectedReturnTrain = null;
        this.returnEdit = !this.returnEdit;
        this.calculateTotal();
      }


    } else {
      this.notification.showWarning(this.translate.instant("Please choose onward train"));
    }
  }

  calculateTotal() {
    this.totalFare = 0;
    if (this.selectedOnwardTrain != null) {
      this.totalFare += ((this.selectedOnwardTrain.selectedPrice * this.trainList.adults) + ((this.selectedOnwardTrain.selectedPrice / 2) * this.trainList.children));

    }
    if (this.selectedReturnTrain != null) {
      this.totalFare += ((this.selectedReturnTrain.selectedPrice * this.trainList.adults) + ((this.selectedReturnTrain.selectedPrice / 2) * this.trainList.children));
    }
  }
  enquire() {

    if (!this.selectedOnwardTrain) {
      this.notification.showWarning(this.translate.instant("Please select a valid onward train"));
      return;
    }
    if (this.hasReturn) {
      if (!this.selectedReturnTrain) {
        this.notification.showWarning(this.translate.instant("Please select a valid return train"));
        return;
      }
    }
    if (!this.acceptTerms) {
      this.notification.showWarning(this.translate.instant("Please accept terms and conditions"));
      return;
    }

    this.submitted = true;
    if(this.trainForm.invalid){
      return
    }

    let journeys = [];
    journeys.push({
      "journey_type": "ONWARD",
      "departure_station_code": this.searchData.departure_code,
      "departure_station": this.searchData.departure_station,
      "arrival_station_code": this.searchData.arrival_code,
      "arrival_station": this.searchData.arrival_station,
      "departure_date": this.searchData.onward_date,
      "departure_time": this.selectedOnwardTrain['Departure time'],
      "arrival_time": this.selectedOnwardTrain['Arrival time'],
      "duration": this.selectedOnwardTrain['Duration'],
      "stops": this.selectedOnwardTrain['Stops'],
      "train_number": this.selectedOnwardTrain['TrainNumber'],
      "seat_class": this.selectedOnwardTrain.selectedClass == 'Economy_Class' ? "ECONOMY_CLASS" : "BUSINESS_CLASS",
      "price": this.selectedOnwardTrain.selectedPrice
    })
    if (this.hasReturn) {
      journeys.push({
        "journey_type": "RETURN",
        "departure_station_code": this.searchData.arrival_code,
        "departure_station": this.searchData.arrival_station,
        "arrival_station_code": this.searchData.departure_code,
        "arrival_station": this.searchData.departure_station,
        "departure_date": this.searchData.return_date,
        "departure_time": this.selectedReturnTrain['Departure time'],
        "arrival_time": this.selectedReturnTrain['Arrival time'],
        "duration": this.selectedReturnTrain['Duration'],
        "stops": this.selectedReturnTrain['Stops'],
        "train_number": this.selectedReturnTrain['TrainNumber'],
        "seat_class": this.selectedReturnTrain.selectedClass == 'Economy_Class' ? "ECONOMY_CLASS" : "BUSINESS_CLASS",
        "price": this.selectedReturnTrain.selectedPrice
      })
    }

    let userDetails = this.trainForm.value;

    let request = {
      "departure_station_code": this.searchData.departure_code,
      "departure_station": this.searchData.departure_station,
      "arrival_station_code": this.searchData.arrival_code,
      "arrival_station": this.searchData.arrival_station,
      "trip_type": this.searchData.trip_type,
      "adults": this.searchData.adults,
      "email": userDetails.email,
      "phone": this.getCountryCode+userDetails.phone_number,
      "children": this.searchData.children,
      "infants": this.searchData.infants,
      "search_id": this.searchId,
      "journeys": journeys,
      "total_price": this.totalFare
    }

    this.trainService.enquire(request).subscribe((data: any) => {
      this.utNo = data.booking_request_no;
      this.showSuccessModal = true;
    }, (err) => {
      this.notification.showError(this.translate.instant("Sorry! We Couldn't submit your request"));
    })
  }

  onCountryChange(event) {
    this.getCountryCode = event.dialCode
  }

  callNan() {
    this.trainService.getCountry("", sessionStorage.getItem('userLanguage')).subscribe((data) => {
      this.nationalityList = data.map(x => ({ item_text: x.name, item_id: x.short_iso_code }));
    });
  }

  inputValidation(event?) {
    try {
    } catch (exception) {
    }
  }

  validateLogin() {
    this.expireTime = true;
    this.disableBookAndContinueBtn = true;
    this.bookContinueBttn = true;
  }

  closeContactPopup() {
    this.contactValidation = false;
  }

  toggleSuccessModal() {
    this.showSuccessModal = !this.showSuccessModal;
    if (!this.showSuccessModal) {
      this.router.navigate(['subagent/train_booking/'+this.language+'/'+this.currency])
    }
  }

  isValidEnquiry() {
    
    if (this.hasReturn) {
      if (!this.selectedOnwardTrain || !this.selectedReturnTrain) {
        return true;
      }
    } else {
      if (!this.selectedOnwardTrain) {
        return true;
      }
    }
    return false;
  }

  telInputObject(obj) {
    this.phoneInputObj = obj;
    this.getLocation()
  }

  getLocation() {
    if (sessionStorage.getItem('country_code') && sessionStorage.getItem('country_code') != undefined && sessionStorage.getItem('country_code') != null) {
      let code = JSON.parse(sessionStorage.getItem('country_code'));
      this.getCountryCode = code.codeNum;
      this.phoneInputObj.setCountry(code.codeText);
    } else {
      this.getCountryCode = '966'
      this.phoneInputObj.setCountry('sa');
      this.getUserLocation();
    }
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.fetchIsoCode(this.lat, this.lng)
      });
    }
  }

  fetchIsoCode(lat, lng) {
    this.trainService.getLocation(lat, lng).subscribe((data: any) => {
      if (data.status == "success") {
        this.phoneInputObj.setCountry(data.data.country_code);
        this.getCountryCode = data.data.code
        let code = {
          codeNum: data.data.code,
          codeText: data.data.country_code,
          currency:data.data.currency
        }
        sessionStorage.setItem('country_code', JSON.stringify(code))
      }
    })
  }
  validateEmail() {
    if (this.email == undefined || this.email == null || this.email == '') {
      this.invalidEmail = true;
    } else {
      this.invalidEmail = false;
    }
  }
  

  
  onTermsClicked(){
    this.userState.isTermsRailActive.next(true);
  }
}
