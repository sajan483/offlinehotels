export interface ImageObject {
  image: any;
  thumbImage: any;
  alt: any;
  title: any;
}

export interface OnwardFlight {
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

export interface ReturnFlight {
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

export interface TripFlight {
  adult_price: number;
  infant_price: number;
  trip_type: string;
  pricing_tui: string;
  onward_flight: OnwardFlight;
  return_flight: ReturnFlight;
}

export interface CustomeTrip {
  title: string;
  max_passengers: number;
  booked_count: number;
  trip_flights: TripFlight[];
}
