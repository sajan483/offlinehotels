

    export interface RoomVariation {
        id: number;
        available_rooms: number;
        total_rooms: number;
        max_guests: number;
        title: string;
        total_price: number;
        room_type: string;
    }

    export interface MakkaTripHotel {
        id: number;
        room_variations: RoomVariation[];
        check_in_date: string;
        num_of_days: number;
        location: string;
        hotel: number;
    }

    export interface RoomVariation2 {
        id: number;
        available_rooms: number;
        total_rooms: number;
        max_guests: number;
        title: string;
        total_price: number;
        room_type: string;
    }

    export interface MadinaTripHotel {
        id: number;
        room_variations: RoomVariation2[];
        check_in_date: string;
        num_of_days: number;
        location: string;
        hotel: number;
    }

    export interface Flight {
        id: number;
        agency: string;
        title: string;
        booked_seats: number;
        boarding_airport?: any;
        destination_airport?: any;
        departure_at_timestamp: number;
        arrival_at_timestamp: number;
        service_no: string;
        airline: string;
        fare_class: string;
        duration: number;
    }

    export interface DepartureFlight {
        id: number;
        available_seats: number;
        total_seats: number;
        infant_price: number;
        adult_price: number;
        flight: Flight;
    }

    export interface Flight2 {
        id: number;
        agency: string;
        title: string;
        booked_seats: number;
        boarding_airport?: any;
        destination_airport?: any;
        departure_at_timestamp: number;
        arrival_at_timestamp: number;
        service_no: string;
        airline: string;
        fare_class: string;
        duration: number;
    }

    export interface ReturnFlight {
        id: number;
        available_seats: number;
        total_seats: number;
        infant_price: number;
        adult_price: number;
        flight: Flight2;
    }

    export interface MakkaGroundTransport {
        id: number;
        vehicle_model: string;
        total_vehicles: number;
        capacity: number;
        departure: string;
        destination?: any;
        instructions?: any;
        price_per_person: number;
        travel_date: string;
        num_of_days: number;
        ground_transport: number;
        source_itinerary?: any;
    }

    export interface MadinaGroundTransport {
        id: number;
        vehicle_model: string;
        total_vehicles: number;
        capacity: number;
        departure: string;
        destination?: any;
        instructions?: any;
        price_per_person: number;
        travel_date: string;
        num_of_days: number;
        ground_transport: number;
        source_itinerary?: any;
    }

    export interface TripVisa {
        id: number;
        title: string;
        adult_price: number;
        child_price?: any;
        country?: any;
    }

    export interface ItinerarySet {
        id: number;
        title: string;
        from_date: string;
        num_of_days: number;
        details: string;
        location?: any;
    }

    export interface PackageObject {
        id: number;
        makka_trip_hotels: MakkaTripHotel[];
        madina_trip_hotels: MadinaTripHotel[];
        departure_flight: DepartureFlight;
        return_flight: ReturnFlight;
        makka_ground_transports: MakkaGroundTransport[];
        madina_ground_transports: MadinaGroundTransport[];
        trip_visas: TripVisa[];
        itinerary_set: ItinerarySet[];
        start_date: string;
        end_date?: any;
        num_days: number;
        title: string;
        status: string;
        max_passengers: number;
        booked_count: number;
        advance_pct: number;
        cost?: any;
        other_charges: number;
        child_with_bed_price: number;
        adult_price: number;
        child_without_bed_price: number;
        infant_price: number;
        instructions: string;
        terms: string;
        inclusions: string;
        exclusions: string;
        owner_id: number;
        owner_type: number;
    }



