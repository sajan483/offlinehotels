export interface Connection {
    Airport: string;
    ArrAirportName: string;
    Duration: string;
    Type: string;
    MAC: string;
}

export interface Flight {
    Stops: number;
    Seats: number;
    ReturnIdentifier: number;
    Index: string;
    Provider: string;
    FlightNo: string;
    VAC: string;
    MAC: string;
    OAC: string;
    ArrivalTime: Date;
    DepartureTime: Date;
    FareClass: string;
    Duration: string;
    GroupCount: number;
    TotalFare: string;
    GrossFare: number;
    TotalCommission: number;
    NetFare: number;
    Hops: number;
    Notice: string;
    NoticeLink: string;
    NoticeType: string;
    Refundable: string;
    Alliances: string;
    Amenities: string;
    Hold: boolean;
    Connections: Connection[];
    From: string;
    To: string;
    FromName: string;
    ToName: string;
    AirlineName: string;
    AirCraft: string;
    RBD: string;
    Cabin: string;
    FBC: string;
    FCBegin?: any;
    FCEnd?: any;
    FCType: string;
    GFL: boolean;
    Promo?: any;
    id: string;
    specialFare:boolean;
    trip_type:string;
    all_return_identifiers:[];
}

export interface FlightObject {
    flights: Flight[][];
    tui: string;
    from_cache: boolean;
    rsid: string;
    notices:string;
    
}