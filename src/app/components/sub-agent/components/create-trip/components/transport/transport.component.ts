import { Component, DoCheck, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslateService } from '@ngx-translate/core';
import { SegmentService } from "ngx-segment-analytics";
import { HedderComponent } from 'src/app/common/components/hedder/hedder.component';
import { HelperService } from "src/app/common/services/helper-service";
import { NotificationService } from "src/app/common/services/notification.service";
import { SubAgentGeneralHelper } from 'src/app/helpers/sub-agent/general-helper';
import { SubAgentApiService } from "src/app/Services/sub-agent-api-services";
import { AppStore } from "src/app/stores/app.store";
import { environment } from "src/environments/environment";
import Swal from 'sweetalert2';
import { Subject, Subscription, timer } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-transport",
  templateUrl: "./transport.component.html",
  styleUrls: ["./transport.component.scss"]
})

export class TransportComponent implements OnInit ,DoCheck ,OnDestroy {
  static trnImageView:boolean;
  private destroy$ = new Subject();
  @Input() dropdownList: any[];
  @Output() notifyGrandparent = new EventEmitter();
  vehicleName: string;
  showTrasportPics:boolean = false;
  paxCount: number;
  healperService: HelperService;
  notifyService: NotificationService;
  commonService: SubAgentApiService;
  noOfVehicle: any;
  aditionalService: any = {};
  addSrvicePrice: number = 0;
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);
  currency: any;
  isTransportSortedByPrice: boolean;
  showCategoryFilter: boolean;
  moreFilterArrow: boolean;
  userFilter: any = { company_name: '' };
  transportFilterData: any
  transportList: any[] = [];
  packagePopup: boolean;
  moreFilter: boolean = false;
  @Input() vehicleTypeData: any[];
  filtervehicle: any[] = [];
  vehicleFilter: any;
  modelList: any;
  additionalServiceList: any;
  modelValue: any[] = [];
  categoryfilterType: any;
  AdditionalList: any[] = [];
  serviceValue: any[] = [];
  modelList1: any[];
  AdditionalList1: any[] = [];
  normalCount: any;
  vipCount: any;
  premiumCount: any;
  categoryActive: any[] = [{ active: false }, { active: false }, { active: false }];
  filaterAdd: boolean;
  baseUrl: string = "";
  prodUrl: string = environment.prodUrl;
  showLinkPopup: boolean = false;
  selectedVehicle: any = "";
  phone_error: boolean;
  tagName: any;
  callB2bLink: boolean = true;
  isLinkReady: boolean = false;
  b2bWhtLnk: any;
  b2bUrl: any;
  phoneNumber: any;
  price: any;
  totalTravellers: string;
  b2bLink: string;
  countryCode: string;
  isTransportSortedByFav:boolean = true;
  activateCreateLinkBtn: boolean = false;
  favLoader: any = { company_code: 0, vehicle_code: 0, category_code: 0 };
  phoneInputObj: any;
  makkaSelectActivate: boolean = false;
  transportPics: any[] = [];
  service: string = "";
  pendingApiTimer = environment.pendingApiTime;
  bookTrnResponse: boolean = false;
  updateTranSubsription: Subscription;
  bookTrnDeepSubscription: Subscription;
  constructor(
    private _healperService: HelperService,
    private _notifyService: NotificationService,
    private _commonService: SubAgentApiService,
    private appStore: AppStore,
    private translate: TranslateService,
    private segment: SegmentService,
    private dom: DomSanitizer) {
    this.healperService = _healperService;
    this.notifyService = _notifyService;
    this.commonService = _commonService;
  }

  onNotify() {
    this.notifyGrandparent.emit("notify parent");
  }

  ngOnInit() {
    this.findProdUrlConfig()
    if (this.baseUrl == this.prodUrl) {
      window.analytics.page('subagent/transport', {
        portal: "B2B"
      });
    }
    this.moreFilterArrow = true;
    var obj = JSON.parse(sessionStorage.getItem('userObject'));
    this.paxCount = obj.adults + obj.children;
    this.noOfVehicle = obj.vehicleCounts;
  }

  findProdUrlConfig() {
    const parsedUrl = new URL(window.location.href);
    this.baseUrl = parsedUrl.origin;
  }

  ngAfterViewChecked() {
    this.translate.use((sessionStorage.getItem('userLanguage') === 'ar-AE') ? "ar-AE" : sessionStorage.getItem('userLanguage'));
    if (sessionStorage.getItem('userLanguage') == "ar-AE" || sessionStorage.getItem('userLanguage') == "ur-UR") {
      (<HTMLInputElement>document.getElementById("body")).classList.add('mirror_css');
    } else {
      (<HTMLInputElement>document.getElementById("body")).classList.remove('mirror_css');
    }
  }

  @Input()
  public set transportData(items: any) {
    this.transportList = items
    this.transportFilterData = items;
    this.calculateCount(items);
    this.filtervehicle = this.vehicleTypeData;
    let vehicleLengthSeden = []; let vehicleLengthSuv = [];
    let vehicleTypedata = []; let vehicleLengthBus = []; let vehicleLengthVan = [];
    this.filtervehicle.map(x => { vehicleTypedata.push(x.count = 0) })
    for (let i = 0; i < this.filtervehicle.length; i++) {
      for (let j = 0; j < this.transportList.length; j++) {
        if (this.filtervehicle[i].item_id == this.transportList[j].vehicle_type_code && this.filtervehicle[i].item_text == this.transportList[j].vehicle_type_name) {
          if (this.filtervehicle[i].item_id == '1') {
            vehicleLengthSeden.push(this.transportList[j])
            this.filtervehicle[i].count = vehicleLengthSeden.length
          }
          if (this.filtervehicle[i].item_id == '2') {
            vehicleLengthSuv.push(this.transportList[j])
            this.filtervehicle[i].count = vehicleLengthSuv.length
          }
          if (this.filtervehicle[i].item_id == '3') {
            vehicleLengthBus.push(this.transportList[j])
            this.filtervehicle[i].count = vehicleLengthBus.length
          }
          if (this.filtervehicle[i].item_id == '4') {
            vehicleLengthVan.push(this.transportList[j])
            this.filtervehicle[i].count = vehicleLengthVan.length
          }
        }
      }
    }
    this.modelList = []; this.modelList1 = []; this.AdditionalList1 = []

    this.transportList.forEach(x => { x.categories[0].additional_services.forEach(y => this.AdditionalList1.push({ serv_text: y.description })) })
    this.service_duplicate(this.AdditionalList1)
    this.transportList.forEach(x => { this.modelList1.push({ model_text: x.categories[0].model }) })
    this.count_duplicate(this.modelList1)
    let typeData = {}
    this.transportList.forEach(x => { if (typeData[x.category_name]) typeData[x.category_name] += 1; else typeData[x.category_name] = 1; })
    for (let i of Object.keys(typeData)) {
      if (i == 'Normal') this.normalCount = typeData[i]
      if (i == 'VIP') this.vipCount = typeData[i]
      if (i == 'Premium') this.premiumCount = typeData[i]
    }
    this.sortListFavorites();
  }

  calculateCount(item) {
    var cuontArray = [];
    this.vehicleTypeData.forEach(data => {
      var item = {
        item_id: data.item_id,
        count: 0,
        name: data.item_text,
        datas: []
      }
      cuontArray.push(item);
    })
    item.forEach(element => {
      cuontArray.forEach((data, indx) => {
        if (element.vehicle_type_code == data.item_id) {
          cuontArray[indx].count = cuontArray[indx].count + 1;
          if (data.datas.length == 0) {
            var value = {
              capacity: element.categories[0].capacity,
              count: 1
            }
            cuontArray[indx].datas.push(value)
          } else {
            var newOne: boolean = true;
            data.datas.forEach((itm, i) => {
              if (itm.capacity == element.categories[0].capacity) {
                data.datas[i].count = data.datas[i].count + 1;
                newOne = false;
              }
            });
            if (newOne) {
              var value = {
                capacity: element.categories[0].capacity,
                count: 1
              }
              cuontArray[indx].datas.push(value)
            }
          }
        }
      })
    });
  }

  count_duplicate(modelList) {
    let model = {}
    modelList.forEach((obj) => {
      const key = `${obj.model_text}`;
      if (!model[key]) {
        model[key] = { ...obj, count: 0 };
      };
      model[key].count += 1;
    });
    this.modelList = Object.values(model)
    this.modelList.forEach(x => { x.checked = false })
  }

  service_duplicate(servList) {
    const service = {};
    servList.forEach((obj) => {
      const key = `${obj.serv_text}`;
      if (!service[key]) {
        service[key] = { ...obj, count: 0 };
      };
      service[key].count += 1;
    });
    this.AdditionalList = Object.values(service)
    this.AdditionalList.forEach(x => { x.checked = false })
  }
  getCheckboxValues(ev, data: any, i) {
    let key = data.company_code + '-' +  data.vehicle_type_code + '-' + data.categories[0].category_code;
    if (ev.checked) {
      var obj: any = {};
      if(this.aditionalService.keys != undefined && this.aditionalService.keys.contains(key)){
        this.aditionalService[key].push(data.categories[0].additional_services[0].additional_service_code);
      }else{
        this.aditionalService[key] = [];
        this.aditionalService[key].push(data.categories[0].additional_services[0].additional_service_code);
      }
      this.addSrvicePrice = data.categories[0].additional_services[0].fare_summary[2].amount
      if (this.addSrvicePrice > 0) {
        obj.name = "Additional Services";
        obj.currency = "SAR";
        obj.amount = this.addSrvicePrice;
      }
      this.transportList[i].categories.forEach((fs) => { fs.fare_summary.push(obj) });
      this.transportList[i].categories.forEach((as) => { as.additional_services.forEach(fs => { fs.fare_summary.forEach((amt) => { if (amt.is_total) { this.transportList[i].display_price = this.transportList[i].display_price + this.addSrvicePrice; } }) }) })
      this.transportList[i].categories[0].display_fare_summary.additional_service_amount = this.addSrvicePrice
      if (this.baseUrl == this.prodUrl) {
        window.analytics.track('additional service selected', {
          portal: "B2B",
          additionalService: this.aditionalService,
          additionalServicePrice: this.addSrvicePrice
        });
      }
    } else {
      if (this.baseUrl == this.prodUrl) {
        window.analytics.track('additional service unselected', {
          portal: "B2B",
          additionalService: this.aditionalService,
          additionalServicePrice: this.addSrvicePrice
        });
      }
      let removeIndex = this.aditionalService[key].findIndex(itm => itm === data.categories[0].additional_services[0].additional_service_code);
      if (removeIndex !== -1) {
        this.transportList[i].categories.forEach((as) => { as.additional_services.forEach(fs => { fs.fare_summary.forEach((amt) => { if (amt.is_total) { this.transportList[i].display_price = this.transportList[i].display_price - amt.amount; } }) }) })
        if (this.addSrvicePrice > 0) { this.transportList[i].categories.forEach((fs) => { fs.fare_summary.splice((fs.fare_summary.length - 1), 1) }); }
        delete this.transportList[i].categories[0].display_fare_summary.additional_service_amount;
        this.aditionalService[key].splice(removeIndex, 1);
      }
    }
  }

  /**
   * This method is for booking vehicles
   */
  bookTransport(company_code, vehicle) {
    let key = company_code + '-' +  vehicle.vehicle_type_code + '-' + vehicle.categories[0].category_code;
    var userDetails = JSON.parse(sessionStorage.getItem('userObject'))
    let start_date_formatted = this.healperService.dateFormaterMdy(userDetails.makkahCheckinDate)
      ? this.healperService.dateFormaterYMd(userDetails.makkahCheckinDate)
      : this.healperService.dateFormaterYMd(userDetails.transportStartDate);
    let end_date_formatted = (sessionStorage.getItem('stage') === '2')
      ? this.healperService.dateFormaterYMd(userDetails.madeenaCheckoutDate)
      : this.healperService.dateFormaterYMd(userDetails.makkahCheckoutDate);
    let arrayList = [];
    let travellerCount = this.paxCount
    let firstcategory = [];
    let code = vehicle.vehicle_type_code[0] ? vehicle.vehicle_type_code[0] : vehicle.vehicle_type_code;
    let x = [vehicle];
    x.forEach((x, index) => {
      let category = {
        code: x.categories[0].category_code,
        additional_services: this.aditionalService[key],
        quantity: this.noOfVehicle,
        pax_per_vehicle: Math.ceil(travellerCount / userDetails.vehicleCounts),
      };

      firstcategory.push(category);
      this.vehicleName = x.vehicle_type_name[0]
    });
    const q = {
      code: code,
      categories: firstcategory,
    };
    arrayList.push(q);


    if (sessionStorage.getItem('custom_trip_id')) {
      let x = {
        adults:userDetails.adults + userDetails.children + userDetails.infant,
        max_passengers: userDetails.adults + userDetails.children + userDetails.infant,
        booked_count: this.paxCount,
        start_date: start_date_formatted,
        end_date: end_date_formatted
          ? end_date_formatted
          : start_date_formatted,
        trip_transportation: {
          search: sessionStorage.getItem('transportSearchId'),
          lang: "en-US",
          company_code: company_code,
          vehicle_types: arrayList,
        },
      };
      if (this.baseUrl == this.prodUrl) {
        window.analytics.track('transport select clicked', {
          portal: "B2B",
          body: x
        });
      }
      this.commonService.updateCustomTrip(sessionStorage.getItem('custom_trip_id'), x, sessionStorage.getItem('userLanguage'),sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe(
        (data) => {
          if (sessionStorage.getItem('custome_trip_booking_id')) {
            this.setStepperIndex();
            this.onNotify();
            (<HTMLElement>(
              document.getElementById("changeTransport")
            )).style.display = "none";
          } else {
            this.setStepperIndex();
            this.onNotify();
          }
        },
        (error) => { }
      );
    } else {
      let x = {
        adults:userDetails.adults + userDetails.children + userDetails.infant,
        max_passengers: userDetails.adults + userDetails.children + userDetails.infant,
        booked_count: this.paxCount,
        start_date: start_date_formatted,
        end_date: end_date_formatted
          ? end_date_formatted
          : start_date_formatted,
        trip_transportation: {
          search: sessionStorage.getItem('transportSearchId'),
          lang: "en-US",
          company_code: company_code,
          vehicle_types: arrayList,
        },
      };
      if (this.baseUrl == this.prodUrl) {
        window.analytics.track('transport select clicked', {
          portal: "B2B",
          body: x
        });
      }

      this.commonService.bookCustomTrip(x,sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe(
        (data:any) => {
          if (this.baseUrl == this.prodUrl) {
            window.analytics.track('transport select clicked', {
              portal: "B2B",
              apiStaus: "success"
            });
          }
          sessionStorage.setItem('custom_trip_id', data.id)
          this.setStepperIndex();
          this.onNotify();
          if (sessionStorage.getItem('custome_trip_booking_id')) {
            this.onNotify();
            (<HTMLElement>(
              document.getElementById("changeTransport")
            )).style.display = "none";
          } else {
            this.setStepperIndex();
            this.onNotify();
          }
        },
        (error) => {
          if (this.baseUrl == this.prodUrl) {
            window.analytics.track('transport select clicked', {
              portal: "B2B",
              apiStaus: "failed"
            });
          }
        }
      );
    }
    var t = JSON.parse(sessionStorage.getItem('steps'))
    if (t.length > 1) {
      sessionStorage.setItem('stage', '3');
    } else {
      sessionStorage.setItem('stage', '1');
    }
    window.scroll(0, 0);
  }
  
  
  transportErrorMsg(){
    this.callB2bLink = true;
    this.isLinkReady = false;
    Swal.fire({
      icon: 'error',
      text: this.translate.instant('Sorry, Not Getting Transport Service Availability From Maqam GDS Please try again'),
      confirmButtonText: this.translate.instant('OK'),
    })
  }

  setStepperIndex() {
    if (!this.appStore.isAvailabilityFails) {
      this.appStore.stepperIndex += 1;
    }
  }

  currencyConversion(amount) {
    return this.subagentHelper.currencyCalculation(amount)
  }

  priceTransportFilter() {
    this.isTransportSortedByPrice = !this.isTransportSortedByPrice;
    if (this.isTransportSortedByPrice == false) return this.transportList.sort((n1, n2) => n1.display_price - n2.display_price);
    else return this.transportList.sort((a, b) => b.display_price - a.display_price);
  }

  showMoreFilter() {
    this.moreFilter = true;
    this.moreFilterArrow = !this.moreFilterArrow;
  }

  closeMoreFilter() {
    this.moreFilterArrow = !this.moreFilterArrow;
  }

  moreFilterList() {
    this.showCategoryFilter = false;
  }


  searchTravelType(type, i) {
    this.categoryActive.forEach((data, indx) => {
      if (indx == i) {
        data.active = true;
      } else {
        data.active = false;
      }
    })
    this.categoryfilterType = type
  }

  getCheckedValue(ev, model, index) {
    if (ev.checked) {
      model.checked = true;
      this.modelValue.push(model.model_text)
    }
    else {
      model.checked = false;
      const index = this.modelValue.indexOf(model.model_text, 0);
      if (index > -1) {
        this.modelValue.splice(index, 1);
      }
    }
  }
  getserviceValue(ev, serv, index) {
    if (ev.checked) {
      serv.checked = true
      this.serviceValue.push(serv.serv_text)
    }
    else {
      serv.checked = false
      const index = this.serviceValue.indexOf(serv.serv_text, 0);
      if (index > -1) {
        this.serviceValue.splice(index, 1);
      }
    }
  }

  filterTransport() {
    this.filaterAdd = true;
    let concat1 = []; let serviceConcat = []
    this.transportList = this.transportFilterData
    if (this.categoryfilterType != undefined && this.categoryfilterType != '') { this.transportList = this.transportList.filter(ele => ele.category_name == this.categoryfilterType) }
    if (this.vehicleFilter != undefined && this.vehicleFilter != '') { this.transportList = this.transportList.filter(ele => ele.vehicle_type_code == this.vehicleFilter) }

    if (this.serviceValue.length > 0) {
      for (let i = 0; i < this.serviceValue.length; i++) {
        this.transportList.filter(element => element.categories[0].additional_services
          .some(subElement => subElement.description === this.serviceValue[i])).map(element => {
            let n = Object.assign({}, element, {
              'additional_services': element.categories[0].additional_services.filter(
                subElement => subElement.description === this.serviceValue[i])
            })
            serviceConcat.push(n)
            return n;
          })
      }
      this.transportList = [serviceConcat].concat.apply([], serviceConcat)
    }
    if (this.modelValue.length > 0) {
      for (let k = 0; k < this.modelValue.length; k++) {
        let data = this.transportList.filter(ele => ele.categories[0].model == this.modelValue[k])
        concat1.push(data);
      }
      this.transportList = [concat1].concat.apply([], concat1)
    }
    this.moreFilterArrow = !this.moreFilterArrow;
  }

  resetFilter() {
    this.filaterAdd = false;
    this.categoryActive = [{ active: false }, { active: false }, { active: false }];
    this.userFilter.company_name = '';
    this.modelValue = []
    this.categoryfilterType = ''
    this.vehicleFilter = ''
    this.serviceValue = []
    this.AdditionalList.forEach(x => { x.checked = false })
    this.modelList.forEach(x => { x.checked = false })
    this.transportList = this.transportFilterData

  }

  onCountryChange(event) {
    this.validateNumber()
    this.phoneInputObj.setCountry(event.iso2);
    this.countryCode = event.dialCode
  }

  inputValidation(event?) {
    if (event) {
      if (event.target.value.length > 0) {
        this.activateCreateLinkBtn = true;
      }else{
        this.activateCreateLinkBtn = false;
      }
    }
  }

  validateNumber() {
    try {
      if (this.phoneNumber) {
        let mobileNumber = this.phoneNumber;
        if (!this.phoneInputObj.isValidNumber()) {
          this.phone_error = true;
          this.activateCreateLinkBtn = false
        } else {
          this.phone_error = false;
          this.activateCreateLinkBtn = true
        }
        // if (this.getNumberPlaceHolderLength() && this.getNumberPlaceHolderLength() != mobileNumber.length) {
        //   this.phone_error = true;
        //   this.activateCreateLinkBtn = false
        // } else {
        //   this.phone_error = false;
        //   this.activateCreateLinkBtn = true
        // }
      }
    } catch (exception) {
      this.phone_error = false;
      alert(this.translate.instant('Enter mobile number'))
    }
  }

  getNumberPlaceHolderLength(): number {
    try {
      let phoneInput: HTMLElement = document.getElementById("phoneInput");
      if (phoneInput)
        return phoneInput.attributes.getNamedItem("placeholder").value.replace(/[^0-9a-zA-Z]/g, '').length;
    } catch (exception) {
    }
  }
  toggleFavourite(selectedVehicle) {
    this.favLoader = { company_code: selectedVehicle.company_code, vehicle_code: selectedVehicle.vehicle_type_code, category_code: selectedVehicle.categories[0].category_code };
    this.transportList.forEach((element) => {
      if (element.company_code == selectedVehicle.company_code && element.vehicle_type_code == selectedVehicle.vehicle_type_code && element.categories[0].category_code == selectedVehicle.categories[0].category_code) {

        this.commonService.makeFavorite({ "transport": [{ company_code: selectedVehicle.company_code, vehicle_code: selectedVehicle.vehicle_type_code, category_code: selectedVehicle.categories[0].category_code }] }).pipe(takeUntil(this.destroy$)).subscribe(
          (data) => {
            this.favLoader = { company_code: 0, vehicle_code: 0, category_code: 0 };
            element.categories[0].is_favorited = !element.categories[0].is_favorited;
            if (element.favorited) {
              this.notifyService.showSuccess("Transport added to favorite")
            } else {
              this.notifyService.showSuccess("Transport removed from favorite")
            }
          },
          (error) => {
            this.favLoader = { company_code: 0, vehicle_code: 0, category_code: 0 };
          }
        );
      }
    });
  }
  favTransportFilter(){
    if(this.isTransportSortedByFav){
      this.transportList.reverse();
    }else{
      this.sortListFavorites();
    }
    this.isTransportSortedByFav  = !this.isTransportSortedByFav;
  }
  sortListFavorites() {
    this.transportList.sort((a, b) => a.categories[0].is_favorited === b.categories[0].is_favorited? 0 : (a.categories[0].is_favorited ? -1 : 1));
  }

  phoneInputObject(obj) {
    this.phoneInputObj = obj;
  }

  showImagePopup(vehicle){
    this.transportPics = [];
    if(vehicle.categories[0].images.length > 0){
      this.showTrasportPics = true;
      TransportComponent.trnImageView = true;
      vehicle.categories[0].images.forEach(element => {
        if(element.webp_url){
          this.transportPics.push(element.webp_url)
        }else{
          this.transportPics.push(element.image_url)
        }
      });
    }
  }

  ngDoCheck() {
    this.currency = HedderComponent.globelCurrency;
    this.service = sessionStorage.getItem('service');
    if(TransportComponent.trnImageView == false){
      this.showTrasportPics = false;
    }
    var obj = JSON.parse(sessionStorage.getItem('userObject'));
    if(obj != null && obj.vehicleCounts){
      this.noOfVehicle = obj.vehicleCounts;
    }
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }
}