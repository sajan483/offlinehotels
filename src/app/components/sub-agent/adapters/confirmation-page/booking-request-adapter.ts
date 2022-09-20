
export class SubAgentBookingRequest {

    constructor(){}

    createTripBookingRequest(travellersForm,roomRef) {
        let passport_no = 0;
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