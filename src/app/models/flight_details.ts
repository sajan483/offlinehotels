

    export interface InfoFlight {
        FUID: number;
        VAC: string;
        MAC: string;
        OAC: string;
        FBC: string;
        Airline: string;
        FlightNo: string;
        ArrivalTime: Date;
        DepartureTime: Date;
        FareClass: string;
        ArrivalCode: string;
        DepartureCode: string;
        ArrivalTerminal: string;
        DepartureTerminal: string;
        ArrAirportName: string;
        DepAirportName: string;
        EquipmentType: string;
        RBD: string;
        Cabin: string;
        Refundable: string;
        Amenities?: any;
        Seats: number;
        Hops?: any;
        Duration: string;
        AirCraft: string;
    }

    export interface PTCFare {
        PTC: string;
        Fare: number;
        YQ: number;
        PSF: number;
        YR: number;
        UD: number;
        K3: number;
        API: number;
        OTT: string;
        OT: string;
        Tax: number;
        GrossFare: number;
        NetFare: number;
        ST: number;
        VATonServiceCharge: number;
        VATonTransactionFee: number;
    }

    export interface Fares {
        PTCFare: PTCFare[];
        GrossFare: number;
        NetFare: number;
        TotalServiceTax: number;
        TotalBaseFare: number;
        TotalTax: number;
        TotalCommission: number;
        TotalVATonServiceCharge: number;
        TotalVATonTransactionFee: number;
    }

    export interface Segment {
        Flight: InfoFlight;
        Fares: Fares;
    }

    export interface FlightDetail {
        Provider: string;
        OrderID: number;
        Stops: number;
        Index: string;
        SPFareNotice: string;
        GrossFare: number;
        NetFare: number;
        Notices: any[];
        Segments: Segment[];
    }

    export interface FlightDetailsObject {
        tui: string;
        net_amount: number;
        ssr_amount: number;
        gross_amount: number;
        from_cache: boolean;
        flight_details: FlightDetail[];
    }


