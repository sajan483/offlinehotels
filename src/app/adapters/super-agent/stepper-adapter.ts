import { HelperService } from "src/app/common/services/helper-service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";


export class StepperAdapter {
  fb: FormBuilder;
  helperService: HelperService;
  searchData:any
    

  constructor(private _helperService: HelperService) {this.helperService = _helperService;}

  /**
   * method for creating hotel search request
   */
  hotelSearchRequest(city: any,dataFromSearchPage: any,hotelSearchForm: FormGroup) {
    if (dataFromSearchPage) {
      if(city == 'MAKKA'){
        var body = {
          check_in_date: dataFromSearchPage.mekkahData.checkIn,
          check_out_date:dataFromSearchPage.mekkahData.checkOut,
          location: city,
        };
        return body;
      }

      if(city == 'MADEENA'){
        var body = {
          check_in_date: dataFromSearchPage.medinaData.checkIn,
          check_out_date: dataFromSearchPage.medinaData.checkOut,
          location: city,
        };
        return body;
      }
    }
    if(hotelSearchForm) {
      var body = {
        check_in_date: hotelSearchForm.get("hotelCheckInDate").value.toJSON().split("T")[0],
        check_out_date:hotelSearchForm.get("hotelCheckOutDate").value.toJSON().split("T")[0],
        location: city
      };
      return body;
    }
  }

  /**
   * this method for validating transport form group
   */
  transportBookingForm(): FormGroup {
    this.fb = new FormBuilder();
    return this.fb.group({
      cabtype: ["", Validators.required],
      route: ["", Validators.required],
    });
  }

  /**
   * this methode for booking transport request
   * @param transportSelection 
   * @param currency 
   */
  transportBookingBody(transportSelection,formValue,route){
    let trans = {
      transport_detail: 
        {
          company_name:transportSelection.company_name,
          company_code:transportSelection.company_code,
          vehicle_type:transportSelection.vehicle_type_name,
          vehicle_code:transportSelection.vehicle_type_code,
          route_name:route,
          route_code:formValue.route,
          num_of_vehicles:1,
          currency:sessionStorage.getItem('currency')
        }
    }
    return trans;
  }

  /**
   * this method for validating other service form group
   */
  otherServiceBookingForm() :FormGroup{
    this.fb = new FormBuilder();
    return this.fb.group({
      arr: this.fb.array([this.createItem()]),
      visaservice: ['',Validators.required],
      adultpricevisa: ['',Validators.required],
      childpricevisa: ['',Validators.required]
    })
  }
  /**
   * this method for validating other service form array
   */
  createItem():FormGroup {
    return this.fb.group({
      category: [''],
      name: [''],
      description: [''],
      price: [''],
    })
  }
  /**
   * other service booking body
   */
  otherServiceBookingBody(arrayvalue,myForm,currency){
    var other : any[]=[];
    arrayvalue.forEach(element => {
      const y = {
        'currency': currency,
        'price': element.price,
        'additional_service':{
          'name' : element.name,
          'description': element.description,
          'category_id': element.category
        },
      }
      other.push(y)
    });
    var body ={
      "other_services":other,
    }
    return body; 
  }

  /**
   * visa service body
   */
  visaServiceBody(myForm,currency){
    var price: number = +myForm.adultpricevisa;
    var kidPrice: number = +myForm.childpricevisa;
    var body ={
      "trip_visa": {
        'visa_type': myForm.visaservice, 
        'price': price,
        'infant_price': kidPrice,
        'currency': currency,
        'title':'visa'
      }
    }
    return body;
  }

  /**
   * payment update form
   */
  paymentUpdateForm():FormGroup{
    this.fb = new FormBuilder();
    return this.fb.group({
      'adult_price': ['', Validators.required],
      'child_with_bed_price': ['', Validators.required],
      'child_without_bed_price': ['', Validators.required],
      'advance_pct': ['', Validators.required],
      'b2b_pct': ['', Validators.required],
    })
  }

  savedPaymentForm(data):FormGroup{
    this.fb = new FormBuilder();
    return this.fb.group({
      'adult_price': [data.adult_price, Validators.required],
      'child_with_bed_price': [data.child_with_bed_price, Validators.required],
      'child_without_bed_price': [data.child_without_bed_price, Validators.required],
      'advance_pct': [data.advance_pct, Validators.required],
      'b2b_pct': [data.b2b_pct, Validators.required],
    })
  }

  /**
   * this method for other service form group
   */
  otherInfoForm():FormGroup{
    this.fb = new FormBuilder();
    return this.fb.group({
      'title': ['', Validators.required],
      'overview': ['', Validators.required],
      'exclusion': ['', Validators.required],
      'inclusion': ['', Validators.required],
      'polices': ['', Validators.required],
      'location': ['', Validators.required],
      'category':['normal', Validators.required]
    })
  }

  masterEditForm():FormGroup{
    this.fb = new FormBuilder();
    return this.fb.group({
      'title': ['', Validators.required],
      'overview': ['', Validators.required],
      'exclusion': ['', Validators.required],
      'inclusion': ['', Validators.required],
      'polices': ['', Validators.required],
      'location': ['', Validators.required],
      'category':['normal', Validators.required],
      'maxPax': ['', Validators.required],
      'selectCurrency': ['', Validators.required]
    })
  }
  /**
   * this method for other itinerary form array
   */
  itinerySet():FormGroup{
    return this.fb.group({
      'days': ['', Validators.required],
      'itinerary_title': ['', Validators.required],
      'depdate': ['', Validators.required],
      'itinerary_overview': ['', Validators.required],
      'urlList': this.fb.array([])
    })
  }
  /**
   * other info body
   * @param item form value
   */
  otherInfoBody(item){
    var body;
    body ={
      'title': item.title, 
      'instructions': item.overview, 
      'exclusions': item.exclusion, 
      'inclusions': item.inclusion,
      'terms':item.polices
    }
    return body;
  }
  /**
   * itinerary body
   * @param item 
   * @param array itinerary images
   */
  itineraryBody(item:any[]){
    let param =[]
    for(let i = 0; i < item.length ; i++){
      let body ={
        'title': item[i].itinerary_title,
        'noOfDays': item[i].days,
        'details': item[i].itinerary_overview,
        'attachments': item[i].urlList,
      }
      param.push(body);
    }
    return param;
  }
  /**For hotel save request
   * @param selectedHotel hotel details
   * @param makkahRoomVariation selected room
   * @param city city makkah or medinah
   */
  saveHotelRequest(selectedHotel,selectRoom,city,days) {

    if(city == 'MAKKA'){
      let body = {
        makkah_hotel_detail: {
          name:selectedHotel.name,
          code:selectedHotel.umrah_hotel_code,
          address:selectedHotel.meta_data.address,
          city:'MAKKAH',
          room_name:selectRoom.name,
          room_code:selectRoom.room_type_code,
          room_description:selectRoom.description,
          room_type:selectRoom.type,
          num_of_days:days,
          room_price:selectRoom.amount,
          location:city,
          rating:selectedHotel.meta_data.rating,
          amenities:selectRoom.features,
          hotel_refundable:selectRoom.cancellation_policy[0].is_refundable,
          // hotel_image:selectedHotel.meta_data.images,
          // room_image:selectRoom.images,
        },
      };
      return body;
    }
    if(city == 'MADEENA'){
      let body = {
        madinah_hotel_detail: {
          name:selectedHotel.name,
          code:selectedHotel.umrah_hotel_code,
          address:selectedHotel.meta_data.address,
          city:'MADEENA',
          room_name:selectRoom.name,
          room_code:selectRoom.room_type_code,
          room_description:selectRoom.description,
          room_type:selectRoom.type,
          num_of_days:days,
          room_price:selectRoom.amount,
          location:city,
          rating:selectedHotel.meta_data.rating,
          amenities:selectRoom.features,
          hotel_refundable:selectRoom.cancellation_policy[0].is_refundable,
          // hotel_image:selectedHotel.meta_data.images,
          // room_image:selectRoom.images,
        },
      };
      return body;
    }
    
  }

  /**
   * For selected hotel request
   * @param item selected room info
   * @param city makkah or medinah
   */
  selectedHotelRequest(item,city){
    var searchData = JSON.parse(sessionStorage.getItem('searchData'))
    if(city == 'MAKKA'){
      var bodyMk = {
        checkin_date :searchData.mekkahData.checkIn,
        checkout_date :searchData.mekkahData.checkOut,
        location : city,
        providers:item.providers,
        hotel_name: item.name,
        umrah_hotel_code:item.umrah_hotel_code,
      }
      return bodyMk;
    }

    if(city == 'MADEENA'){
     var bodyMd = {
      checkin_date :searchData.medinaData.checkIn,
      checkout_date :searchData.medinaData.checkOut,
        location : city,
        providers:item.providers,
        hotel_name: item.name,
        umrah_hotel_code:item.umrah_hotel_code,
      }
      return bodyMd;
    }
  }
}