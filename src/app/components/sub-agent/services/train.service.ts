import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class TrainService {

    options = {
        headers:{
          "Content-Type": "application/json",
          Authorization: "Bearer Guest",
        },
      };
    constructor(public https: HttpClient) { }

    getFromStations(){
      return this.https
      .get( "rails/from_station/",this.options)
    }

    getToStations(from){
      return this.https
      .get( "rails/to_station/?from="+from,this.options)
    }

    search(data){
      return this.https
      .post( "rails/search/",data,this.options)
    }

    searchTrains(id){
      return this.https
      .get( "rails/?search_id="+id,{observe:'response', headers:{
        "Content-Type": "application/json",
        Authorization: "Bearer Guest",
      },},)
    }

    enquire(data){
      const token = sessionStorage.getItem('guestBookingToken') ? sessionStorage.getItem('guestBookingToken') : 'Guest';
      return this.https
      .post( "rails/booking_request/",data)
    }


    saveTravellers(id,data){
      const token = sessionStorage.getItem('guestBookingToken') ? sessionStorage.getItem('guestBookingToken') : 'Guest';
      return this.https
      .post( "rails/booking/"+id + '/travellers/',data)
    }

    updateTravellers(id,data){
      return this.https
      .patch( "rails/booking/"+id + '/travellers/',data)
    }

    getTrainBookings(page): Observable<any> {
      return this.https
        .get("rails/booking_request/?page="+page)
    }
  
    getTrainBookingDetails(id): Observable<any> {
      return this.https
        .get("rails/booking_request/"+id+"/")
    }
  
    railPayment(id){
      return this.https.post("rails/payments/",{
        "booking_id":id
      });
    }
    
    loginUsingFirebase(data: any) {
      return this.https
        .post( "b2capis/login/v2/verify_firebase_otp/", data)
  
    }
    getLocation(lat,lon){
      return this.https
        .get( "get_location/?latitude="+lat+"&longitude="+lon);
    }
  
    loginUsingWhatsapp(data: any) {
      return this.https
        .post( "b2capis/login/generate_otp/", data)
  
    }

  getCountry(data, lang): Observable<any> {
    return this.https
      .get("countries/?search=" + data + "&lang=" + lang)

  }

}


