import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { HelperService } from "src/app/common/services/helper-service";
import { DateTimeToDateFormat } from "src/app/helpers/date_time/date_pipe";

export class CreateTripAdapter {
  constructor(
    private helperService: HelperService,
    private dateForm: DateTimeToDateFormat,
  ) {}

  /**
   * method for creating hotel search request
   */
  hotelSearchRequest(city: any, userDetails: any) {
    var paxArr = JSON.parse(sessionStorage.getItem('paxArray'));
    var rooms = JSON.parse(sessionStorage.getItem('roomData'));
    if (rooms && rooms.length > 0) {
      rooms.forEach((item, i) => {
        item.seq_no = i.toString();
        delete item.id;
        delete item.pax_info_str;
      });
    }
    if (userDetails && city == "MAKKA") {
      var body = {
        check_in_date: this.helperService.dateFormaterMdy(
          userDetails.makkahCheckinDate
        ),
        check_out_date: this.helperService.dateFormaterMdy(
          userDetails.makkahCheckoutDate
        ),
        subpcc_code: userDetails.subPcc_makkah,
        special_code: userDetails.specialCodeMakkah,
        rooms: rooms,
        location: city,
        room_type: paxArr.roomType,
      };
    }
    if (userDetails && city == "MADEENA") {
      var body = {
        check_in_date: this.helperService.dateFormaterMdy(
          userDetails.madeenaCheckinDate
        ),
        check_out_date: this.helperService.dateFormaterMdy(
          userDetails.madeenaCheckoutDate
        ),
        subpcc_code: userDetails.subPcc_medinah,
        special_code: userDetails.specialCodeMedinah,
        rooms: rooms,
        location: city,
        room_type: paxArr.roomType
      };
    }
    return body;
  }

  /**
   * Method for creating  hotel details request
   */
  selectedHotelInfoRequest(
    selectedLanguage: any,
    selectedHotelInfo: any,
    search: any
  ) {
    var obj = sessionStorage.getItem("userObject");
    var subpcc = "";
    var specialCode = "";
    if (selectedHotelInfo.config.location == "MAKKA") {
      search = sessionStorage.getItem('mkSearchId');
      subpcc = JSON.parse(obj).subPcc_makkah;
      specialCode = JSON.parse(obj).specialCodeMakkah;
    }
    if (selectedHotelInfo.config.location == "MADEENA") {
      search = sessionStorage.getItem('mdSearchId');
      subpcc = JSON.parse(obj).subPcc_medinah;
      specialCode = JSON.parse(obj).specialCodeMedinah;
    }
    var body = {
      subpcc_code:subpcc,
      special_code:specialCode,
      search: search,
      lang: selectedLanguage,
      providers: selectedHotelInfo.providers,
      hotel_name: selectedHotelInfo.name,
      umrah_hotel_code: selectedHotelInfo.umrah_hotel_code,
      location_code: selectedHotelInfo.location_code,
    };

    return body;
  }

  bookHotelRequest(
    isGrouped: boolean,
    selectedRoomGroups: any[],
    selectedHotel: any,
    selectedHotelInfo: any,
    numberOfDays:number
  ) {
    var roomVariations: any = {};
    var roomVariationArray: any[] = [];
    if (!isGrouped) {
      var obj= JSON.parse(sessionStorage.getItem("userObject"))
      let v = selectedRoomGroups.concat.apply([],selectedRoomGroups)
      v = v.filter((v,i,a)=>a.findIndex(t=>(t.group_id === v.group_id))===i)
      v.forEach(x=>x.rooms = x.rooms.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name))===i))
      let y = v.filter((v,i,a)=>a.findIndex(t=>(t.group_id === v.group_id))===i)
      selectedRoomGroups = y;
      for (let i = 0; i < selectedRoomGroups.length; i++) {
        for (let j = 0; j < selectedRoomGroups[i].rooms.length; j++) {
          if (selectedRoomGroups[i].rooms[j].isRoomSelectionChecked) {
            roomVariations = {};
            (roomVariations.currency = selectedHotel.currency),
              (roomVariations.available_rooms =
                selectedRoomGroups[i].rooms[j].available_count);
            (roomVariations.total_rooms =
              selectedRoomGroups[i].rooms[j].quantity),
              (roomVariations.max_guests =
                selectedRoomGroups[i].rooms[j].pax_info[0].quantity),
              (roomVariations.title = selectedRoomGroups[i].rooms[j].name),
              (roomVariations.per_room_price =
                selectedRoomGroups[i].rooms[j].selected_board_type.amount),
              (roomVariations.custom_pax_info =
                selectedRoomGroups[i].pax_info_str);
            (roomVariations.room_type =
              selectedRoomGroups[i].rooms[j].room_type),
              (roomVariations.description =
                selectedRoomGroups[i].rooms[j].description),
              (roomVariations.room_group_id =
                selectedRoomGroups[i].rooms[j].selected_board_type.room_group_id),
              (roomVariations.room_id = selectedRoomGroups[i].rooms[j].selected_board_type.room_id),
              (roomVariations.meal_title = selectedRoomGroups[i].rooms[j].selected_board_type.meal_title),
              (roomVariations.room_group_obj =
                selectedRoomGroups[i].rooms[j].selected_board_type.room_group_obj);
            roomVariationArray.push(roomVariations);
          }
        }
      }
    }
    if (isGrouped) {
      selectedRoomGroups.forEach(x=>x.rooms = x.rooms.filter((v,i,a)=>a.findIndex(t=>(t.room_id === v.room_id))===i))
      for (let i = 0; i < selectedRoomGroups.length; i++) {
        if (selectedRoomGroups[i].isRoomSelectionChecked) {
          for (let j = 0; j < selectedRoomGroups[i].rooms.length; j++) {
            roomVariations = {};
            (roomVariations.currency = selectedHotel.currency),
              (roomVariations.available_rooms =
                selectedRoomGroups[i].rooms[j].available_count);
            (roomVariations.total_rooms =
              selectedRoomGroups[i].rooms[j].max_rooms),
              (roomVariations.max_guests =
                selectedRoomGroups[i].rooms[j].pax_info[0].quantity),
              (roomVariations.title = selectedRoomGroups[i].rooms[j].name),
              (roomVariations.per_room_price =
                selectedRoomGroups[i].rooms[j].amount),
              (roomVariations.custom_pax_info =
                selectedRoomGroups[i].rooms[j].pax_info_str);
            (roomVariations.room_type =
              selectedRoomGroups[i].rooms[j].room_type),
              (roomVariations.description =
                selectedRoomGroups[i].rooms[j].description),
              (roomVariations.room_group_id =
                selectedRoomGroups[i].rooms[j].room_group_id),
              (roomVariations.room_id = selectedRoomGroups[i].rooms[j].room_id),
              ( roomVariations.meal_title = selectedRoomGroups[i].rooms[j].meal_title),
              (roomVariations.room_group_obj =
                selectedRoomGroups[i].rooms[j].room_group_obj);
            roomVariationArray.push(roomVariations);
          }
        }
      }
    }
    var latitude: number = +selectedHotel.meta_data.latitude;
    var longitute: number = +selectedHotel.meta_data.longitude;
    var body = {};
    if (selectedHotelInfo.config.location == "MAKKA") {
      body = {
        start_date: this.dateForm.transform(selectedHotel.check_in_time),
        end_date: this.dateForm.transform(selectedHotel.check_out_time),
        arr_date_time_stamp: this.helperService.dateTimeStringToTimeStampConverter(
          selectedHotel.check_in_time
        ),
        adults:obj.adults,
        children: obj.children,
        country_of_residence: "IN",
        nationality: "IN",
        makkah_trip_hotel: {
          search: sessionStorage.getItem('mkSearchId'),
          lang: "en-US",
          hotel: {
            name: selectedHotel.name,
            description: selectedHotel.description,
            address: selectedHotel.meta_data.address,
            longitute: longitute.toFixed(6),
            latitude: latitude.toFixed(6),
            phone_number: selectedHotel.meta_data.phone
              ? selectedHotel.meta_data.phone
              : "1232323232",
            email: selectedHotel.meta_data.email,
            state: selectedHotel.meta_data.state
              ? selectedHotel.meta_data.state
              : "MAKKA",
            city: selectedHotel.meta_data.city,
            instructions: "",
            distance: selectedHotel.haram_distance,
            user_review: selectedHotel.meta_data.rating
              ? selectedHotel.meta_data.rating
              : 3.4,
            provider: selectedHotel.provider,
            vendor: selectedHotel.vendor,
            code: selectedHotel.code,
            umrah_code: selectedHotel.umrah_hotel_code,
            images: selectedHotel.meta_data.images,
            amenities: selectedHotel.meta_data.amenities,
            policies: selectedHotel.policies,
          },
          room_variations: roomVariationArray,
          check_in_time: selectedHotel.check_in_time,
          check_out_time: selectedHotel.check_out_time,
          other_data: selectedHotel.other_data,
          num_of_days: numberOfDays
        },
      };
    }

    if (selectedHotelInfo.config.location == "MADEENA") {
      body = {
        start_date: this.dateForm.transform(selectedHotel.check_in_time),
        end_date: this.dateForm.transform(selectedHotel.check_out_time),
        arr_date_time_stamp: this.helperService.dateTimeStringToTimeStampConverter(
          selectedHotel.check_in_time
        ),
        adults:obj.adults,
        children: obj.children,
        country_of_residence: "IN",
        nationality: "IN",
        medinah_trip_hotel: {
          search: sessionStorage.getItem('mdSearchId'),
          lang: "en-US",
          hotel: {
            name: selectedHotel.name,
            description: selectedHotel.description,
            address: selectedHotel.meta_data.address,
            longitute: longitute.toFixed(6),
            latitude: latitude.toFixed(6),
            phone_number: selectedHotel.meta_data.phone
              ? selectedHotel.meta_data.phone
              : "1232323232",
            email: selectedHotel.meta_data.email,
            state: selectedHotel.meta_data.state
              ? selectedHotel.meta_data.state
              : "MADEENA",
            city: selectedHotel.meta_data.city,
            instructions: "",
            distance: selectedHotel.haram_distance,
            user_review: selectedHotel.meta_data.rating
              ? selectedHotel.meta_data.rating
              : 3.4,
            provider: selectedHotel.provider,
            vendor: selectedHotel.vendor,
            code: selectedHotel.code,
            umrah_code: selectedHotel.umrah_hotel_code,
            images: selectedHotel.meta_data.images,
            amenities: selectedHotel.meta_data.amenities,
            policies: selectedHotel.policies,
          },
          room_variations: roomVariationArray,
          check_in_time: selectedHotel.check_in_time,
          check_out_time: selectedHotel.check_out_time,
          other_data: selectedHotel.other_data,
          num_of_days: numberOfDays
        },
      };
    }

    return body;
  }

  createTripBookingForm(): FormGroup {
    return new FormGroup({
      title: new FormControl("",Validators.required),
      first_name: new FormControl("", [Validators.required, Validators.minLength(3)]),
      last_name: new FormControl("", [Validators.required, Validators.minLength(3)]),
      nationality: new FormControl("",Validators.required),
      tag:new FormControl(""),
      passport_no: new FormControl(""),
      dob: new FormControl("2015-05-14"),
      passport_expiry_date: new FormControl(this.helperService.incrimentmonth(new Date,12)),
      email: new FormControl(""),
      countryOFRecidence: new FormControl(""),
      phone_number: new FormControl(""),
      phone_country_code: new FormControl(""),
    });
  }

  createTripBookingRequest(travellersForm,roomRef) {
    let passport_no = 0;
    console.log(travellersForm);
    
    if(!(travellersForm.passport_no.value == undefined || travellersForm.passport_no.value == null || travellersForm.passport_no.value =="")){
      passport_no = travellersForm.passport_no.value;
    }
    let expire;
    if(typeof(travellersForm.passport_expiry_date) == typeof{}){
      expire = travellersForm.passport_expiry_date.toJSON().split("T")[0]
    }else{
      expire = travellersForm.passport_expiry_date.split("T")[0]
    }
   let body = {
      title: travellersForm.title,
      first_name:travellersForm.first_name,
      last_name: travellersForm.last_name,
      dob: (travellersForm.dob.length == 10) ? travellersForm.dob: travellersForm.dob.toJSON().split("T")[0],
      nationality: travellersForm.nationality,
      passport_no: passport_no,
      room_reference: roomRef,
      passport_expiry_date:expire,
      country_of_residence:travellersForm.countryOFRecidence,
      contactinfo: {
        title: travellersForm.title,
        first_name:travellersForm.first_name,
        last_name: travellersForm.last_name,
        email:travellersForm.email,
        phone_number:travellersForm.phone_number,
        phn_country_code: travellersForm.phone_country_code,
      },
    };
    return body;
  }
}
