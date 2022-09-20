export interface listHistory {
    id:               number;
    total_amount:     number;
    status:           string;
    payment_status:   null;
    custom_trip:      CustomTrip;
    booking_date:     Date;
    staff_name:       string;
    travellers_count: number;
}

export interface CustomTrip {
    id:          number;
    start_date:  Date;
    end_date:    Date;
    adults:      number;
    children:    number;
    infants:     number;
    country:     null;
    nationality: string;
    source:      null;
    destination: null;
    makkah_trip: MakkahTrip;
}

export interface MakkahTrip {
    name:   string;
    rating: number;
    brn:    null;
}