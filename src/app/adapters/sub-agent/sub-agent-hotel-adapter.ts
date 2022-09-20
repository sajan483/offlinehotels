import { HelperService } from "src/app/common/services/helper-service";
import { DateTimeToDateFormat } from "src/app/helpers/date_time/date_pipe";

export class SubAgentHotelAdapter {

    constructor(
        private helperService: HelperService,
        private dateForm: DateTimeToDateFormat,
      ) {}

    bookHotelRequest(
        isGrouped: boolean,
        selectedRoomGroups: any[],
        selectedHotel: any,
        city: any,
        numberOfDays:number,
        adultCount:number,
        childCount:number,
        searchId:number
      ) {
        let roomVariations: any = {};
        let roomVariationArray: any[] = [];
        if (!isGrouped) {
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
        let latitude: number = +selectedHotel.meta_data.latitude;
        let longitute: number = +selectedHotel.meta_data.longitude;

        let hotelData = {
            search: searchId,
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
                  : city,
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
        }

        var body = {};
        if (city == "MAKKA") {
          body = {
            start_date: this.dateForm.transform(selectedHotel.check_in_time),
            end_date: this.dateForm.transform(selectedHotel.check_out_time),
            arr_date_time_stamp: this.helperService.dateTimeStringToTimeStampConverter(
              selectedHotel.check_in_time
            ),
            adults:adultCount,
            children: childCount,
            country_of_residence: "IN",
            nationality: "IN",
            makkah_trip_hotel: hotelData
          };
        }
    
        if (city == "MADEENA") {
          body = {
            start_date: this.dateForm.transform(selectedHotel.check_in_time),
            end_date: this.dateForm.transform(selectedHotel.check_out_time),
            arr_date_time_stamp: this.helperService.dateTimeStringToTimeStampConverter(
              selectedHotel.check_in_time
            ),
            adults:adultCount,
            children: childCount,
            country_of_residence: "IN",
            nationality: "IN",
            medinah_trip_hotel: hotelData
          };
        }
    
        return body;
      }

      createTripBookingRequest(travellersForm,roomRef){
        
      }

}