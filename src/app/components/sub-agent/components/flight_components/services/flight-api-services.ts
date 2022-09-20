import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import Swal from "sweetalert2";
import { BehaviorSubject, Observable } from "rxjs/Rx";
import { SubAgentModule } from "../../../module/sub-agent.module";




@Injectable({
  providedIn: SubAgentModule
})
export class FlightServices {
  isProcessing = new BehaviorSubject(false)
  constructor(public http: HttpClient) { }

  errorMsg() {
    Swal.fire({
      icon: "error",
      title: 'Error!',
      text: "Something went wrong !!",
      confirmButtonText: "ok",
    })
  }

  errorMsg2(msg) {
    Swal.fire({
      icon: "error",
      title: 'Error!',
      text: msg,
      confirmButtonText: "ok",
    })
  }

  searchFlights(data: any, key, currency): Observable<any> {
    return this.http
      .post("b2capis/flights/search/?currency=" + currency + "&ulog-id=" + key + "/", data)

  }

  getSpecialFare(id: any): Observable<any> {
    return this.http
      .get("b2capis/flights/special_fare_ids/?search_id=" + id)

  }
  getFareRules(data: any, id: any, currency): Observable<any> {
    return this.http
      .post("b2capis/flights/fare_rules/?search_id=" + id + "&currency=" + currency, data)

  }

  getFlights(id: any, key, currency): Observable<any> {
    return this.http
      .get("b2capis/flights/?search_id=" + id + "&currency=" + currency + "&ulog-id=" + key + "/")

  }

  getReturnFlights(data: any, id: any, key, currency): Observable<any> {
    return this.http
      .post("b2capis/flights/return_flights/?search_id=" + id + "&currency=" + currency + "&ulog-id=" + key + "/", data)

  }

  createTripFlight(data: any, key, currency): Observable<any> {
    return this.http
      .post("b2capis/custom_trips/?&currency=" + currency + "&ulog-id=" + key + "/", data)

  }
  createTripFlightB2B(data: any, key, currency): Observable<any> {
    return this.http
      .post("custom_trips/?&currency=" + currency + "&ulog-id=" + key + "/", data)

  }

  getAirportListD(lang): Observable<any> {
    return this.http.get(
      "airports/autocomplete/?airport_type=DESTINATION&lang=" + lang

    );
  }

  getAirportList(airport: String, lang): Observable<any> {
    return this.http.get(
      "airports/autocomplete/?airport_type=DESTINATION&airport_type=BOARDING&search=" +
      airport + "&lang=" + lang

    );
  }

  getDestinationAirport(lang): Observable<any> {
    return this.http.get(
      "airports/autocomplete/?airport_type=BOARDING&lang=" + lang

    );
  }

  getFlightPricingInfo(id: any): Observable<any> {
    return this.http
      .get("b2capis/trips/" + id + "/flight_pricing/")

  }

  getFlightDetails(data: any, id: any, currency): Observable<any> {
    return this.http
      .post("b2capis/flights/flight_info/?search_id=" + id + "&currency=" + currency, data)

  }

  getSSR(data: any, id: any): Observable<any> {
    return this.http
      .post("b2capis/flights/flight_ssr/?search_id=" + id, data)

  }

  getNationality(data, lang): Observable<any> {
    return this.http
      .get("nationalities/?search=" + data + "&lang=" + lang)

  }

  getCountry(data, lang): Observable<any> {
    return this.http
      .get("countries/?search=" + data + "&lang=" + lang)

  }




  updateCustomTrip(id, data, currency, lang, key): Observable<any> {
    return this.http
      .put("b2capis/custom_trips/" + id + "/?currency=" + currency + "&lang=" + lang + "?ulog-id=" + key + "/", data)
  }

  generateShareLink(id, body): Observable<any> {
    return this.http
      .post("b2capis/custom_trips/" + id + "/generate_trip_link/", body)
  }



  getShortenUrl(data): Observable<any> {
    return this.http
      .post("shortenurl/", data)
  }

  flightItinerary(id, key): Observable<any> {
    return this.http
      .get("b2capis/custom_trip_booking/" + id + "/flight_itinerary/?ulog-id=" + key + "/")
  }

  checkAvailability(id, key): Observable<any> {
    return this.http
      .get("b2capis/custom_trip_booking/" + id + "/check_availability/?ulog-id=" + key + "/")
  }



  getTrip(id, currency, lang, key): Observable<any> {
    return this.http
      .get("b2capis/custom_trips/" + id + "/?currency=" + currency + "&lang=" + lang + "?ulog-id=" + key + "/")
  }


  getFlightPricing(id): Observable<any> {
    return this.http
      .get("b2capis/custom_trips/" + id + "/flight_pricing/")
  }

  getFlightAddons(id: number): Observable<any> {
    return this.http
      .get("b2capis/custom_trips/" + id + "/flight_addons/")
  }
}
