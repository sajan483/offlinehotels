

    export class OnwardFlight {
        booked_seats: number;
        flight_no: string;
        index: string;
        provider: string;
        vac: string;
        mac: string;
        oac: string;
        search_tui: string;
        flight_type: string;
        departure_at_timestamp: number;
        arrival_at_timestamp: number;
        service_no: string;
        airline: string;
        fare_class: string;
        boarding_airport: string;
        destination_airport: string;
    }

    export class ReturnFlight {
        booked_seats: number;
        flight_no: string;
        index: string;
        provider: string;
        vac: string;
        mac: string;
        oac: string;
        search_tui: string;
        flight_type: string;
        departure_at_timestamp: number;
        arrival_at_timestamp: number;
        service_no: string;
        airline: string;
        fare_class: string;
        boarding_airport: string;
        destination_airport: string;
    }

    export class TripFlight {
        adult_price: number;
        infant_price: number;
        trip_type: string;
        pricing_tui: string;
        onward_flight: OnwardFlight;
        return_flight: ReturnFlight;
    }

    export class Trip{
        index:string;
        amount: number;
    }

    export class TripRoom{
        adults:number;
        children:number;
        child_ages:string[];
        roomGroups: any[];
        diffDays: number;
        isGrouped: boolean;
        hotelPics: any[];
        roomCount: number;
        isSelectBtnActive:boolean;
        roomPrice:number;
    }

    export class ImageObject {
        image: any;
        thumbImage: any;
        alt: any;
        title: any;
      }
    export class HotelsList{
        response : any[];
        city : string;
    }

    export class CustomeTrip {
        title: string;
        max_passengers: number;
        booked_count: number;
        trip_flights: TripFlight[];
        tui:string;
        trip_type:string;
        trips:Trip[];
        check_in_date:string;
        check_out_date:string;
        rooms:TripRoom[];
        trip:string;
        location:string;
    }
