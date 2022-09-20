import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { CustomeTrip, Trip } from 'src/app/models/custome_trip';


export class FlightAdapter {
  datepipe: DatePipe;
    constructor() {
      this.datepipe = new DatePipe("en-US");
    }

    setDataForTrip(onwardCardData, returnCardData, ddate, rdate, userObject,search_id) {
        let trip = {

            "title": "customtrip",
            "currency": sessionStorage.getItem('userCurrency'),

            "max_passengers": userObject.adultCount + userObject.childCount + userObject.infantCount,

            "adults": userObject.adultCount,

            "children": userObject.childCount,

            "infants": userObject.infantCount,

            "booked_count": userObject.adultCount + userObject.childCount,

            "start_date": this.dateFormater2(ddate),

            "end_date": this.dateFormater2(rdate),

            "custom_trip_search": {

                "boarding_airport": onwardCardData.From,

                "destination_airport": returnCardData.To,

                "onward_date": this.dateFormater2(ddate),

                "return_date": this.dateFormater2(rdate),

                "adults": userObject.adultCount,

                "children": userObject.childCount,

                "infants": userObject.infantCount,

                "travel_class": userObject.flightclass,
            },

            "trip_flights": [{

                "adult_price": onwardCardData.actual_netfare,

                "infant_price": 1000,

                "search_id": search_id,

                "onward_flight":

                {

                    "booked_seats": onwardCardData.Seats,

                    "flight_type": "ONWARD",

                    "flight_id": onwardCardData.id,

                    "boarding_airport": onwardCardData.From,

                    "destination_airport": onwardCardData.To,

                    "departure_at_timestamp": this.dateTimeStringToTimeStampConverter(onwardCardData.DepartureTime),

                    "arrival_at_timestamp": this.dateTimeStringToTimeStampConverter(onwardCardData.ArrivalTime),

                    "flight_no": onwardCardData.FlightNo,

                    "instructions": "SDS",

                    "fare_class": "J",

                    "stops": onwardCardData.Stops,

                    "seats": onwardCardData.Seats,

                    "index": onwardCardData.Index,

                    "provider": onwardCardData.Provider,

                    "vac": onwardCardData.VAC,

                    "mac": onwardCardData.MAC,

                    "oac": onwardCardData.OAC,

                    "gross_fare": onwardCardData.GrossFare,

                    "total_commission": onwardCardData.TotalCommission,

                    "airline_name": onwardCardData.AirlineName,

                    "aircraft": onwardCardData.AirCraft,

                    "fbc": onwardCardData.FBC,

                    "netfare": onwardCardData.NetFare,

                    "refundable": onwardCardData.Refundable,

                    "alliances": onwardCardData.Alliances,

                    "rbd": onwardCardData.RBD,

                    "cabin": onwardCardData.Cabin,

                    "promo": onwardCardData.Promo,

                    "connections": onwardCardData.Connections,

                    "search_tui": localStorage.getItem("triptoken")

                },

                "return_flight": {

                    "booked_seats": returnCardData.Seats,

                    "flight_id": returnCardData.id,

                    "flight_type": "RETURN",

                    "boarding_airport": returnCardData.From,

                    "destination_airport": returnCardData.To,

                    "departure_at_timestamp": this.dateTimeStringToTimeStampConverter(returnCardData.DepartureTime),

                    "arrival_at_timestamp": this.dateTimeStringToTimeStampConverter(returnCardData.ArrivalTime),

                    "flight_no": returnCardData.FlightNo,

                    "instructions": "SDS",

                    "fare_class": "J",

                    "stops": returnCardData.Stops,

                    "seats": returnCardData.Seats,

                    "index": returnCardData.Index,

                    "provider": returnCardData.Provider,

                    "vac": returnCardData.VAC,

                    "mac": returnCardData.MAC,

                    "oac": returnCardData.OAC,

                    "gross_fare": returnCardData.GrossFare,

                    "total_commission": returnCardData.TotalCommission,

                    "airline_name": returnCardData.AirlineName,

                    "aircraft": returnCardData.AirCraft,

                    "fbc": returnCardData.FBC,

                    "netfare": returnCardData.NetFare,

                    "refundable": returnCardData.Refundable,

                    "alliances": returnCardData.Alliances,

                    "rbd": returnCardData.RBD,

                    "cabin": returnCardData.Cabin,

                    "promo": returnCardData.Promo,

                    "connections": returnCardData.Connections,

                    "search_tui": localStorage.getItem("triptoken")

                },

                "trip_type": onwardCardData.trip_type,

                "pricing_tui": "e4df7ecb-817b-4f8c-950e-876996601024|f76fe60b-925d-4df7-bea8-addd771bdf06|20200526121754"

            }]
        }

        return trip;

    }

    dateFormater2(date: any) {
        let latest_date = this.datepipe.transform(date, "yyyy-MM-dd");
        return latest_date;
    }


    dateTimeStringToTimeStampConverter(date: any) {
        let date1 = Date.parse(date);
        return Math.ceil(date1 / 1000);
    }

    setDataForFlightSSR(onwardCardData, returnCardData) {
        let trip1 = new Trip();
        trip1.index = onwardCardData['Index'];
        trip1.amount = onwardCardData['actual_netfare'];
        let trip2 = new Trip();
        trip2.index = returnCardData['Index'];
        trip2.amount = returnCardData['actual_netfare'];
            // returnCardData['fare_type'] == "special_round_trip"
            //     ? returnCardData['display_amount']
            //     : returnCardData['actual_netfare'];

        //trip2.amount = returnCardData['actual_netfare']
        let tripList: any[] = [];
        tripList.push(trip1);
        tripList.push(trip2);

        let ssrBody = new CustomeTrip();
        ssrBody.trip_type = returnCardData.trip_type;
        ssrBody.trips = tripList;
        return ssrBody;
    }

    selectedFlightRequest(returnCardData, onwardCardData, obj) {
        let infoParams = {
            fare_type:  returnCardData.trip_type,
            adults: obj.adultCount,
            children: obj.childCount,
            infants: obj.infantCount,
            trips: [
                {
                    order_id: 1,
                    flight_index:
                        returnCardData['trip_type'] == "special_round_trip"
                            ? returnCardData['onward_flight_index']
                            : onwardCardData['Index'],
                    amount: onwardCardData['actual_netfare'].toString()
                        // returnCardData['trip_type'] == "special_round_trip"
                        //     ? returnCardData['display_amount'].toString()
                        //     : onwardCardData['actual_netfare'].toString(),
                },
                {
                    order_id: 2,
                    flight_index: returnCardData['Index'],
                    amount:  returnCardData['actual_netfare'].toString(),
                        // returnCardData['trip_type'] == "special_round_trip"
                        //     ? returnCardData['display_amount'].toString()
                        //     : returnCardData['actual_netfare'].toString(),
                },
            ],
        };
        return infoParams
    }


    flightFareRuleRequest(returnCardData, onwardCardData,obj) {
        let infoParams = {
            fare_type: returnCardData.trip_type,
            adults: obj.adultCount,
            children: obj.childCount,
            infants: obj.infantCount,
            trips: [
                {
                    order_id: 1,
                    flight_index:
                        returnCardData.trip_type == "special_round_trip"
                            ? returnCardData.onward_flight_index
                            : onwardCardData.Index,
                    amount:
                        returnCardData.trip_type == "special_round_trip"
                            ? onwardCardData.actual_netfare
                            : returnCardData.actual_netfare,
                },
                {
                    order_id: 2,
                    flight_index: returnCardData.Index,
                    amount: returnCardData.actual_netfare
                        // returnCardData.trip_type == "special_round_trip"
                        //     ? returnCardData.display_amount
                        //     : returnCardData.actual_netfare,
                },
            ],
        };
        return infoParams
    }

}
