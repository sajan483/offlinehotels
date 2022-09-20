

    export interface Rate {
        total: number;
        baseRate: number;
        commission: number;
        discounts: number;
        taxes: number;
        provider: string;
        pointEquivalent: number;
        otherRateComponents?: any;
        offer?: any;
        gstOnCommission: number;
    }

    export interface Facility {
        id: number;
        groupId: number;
        name: string;
    }

    export interface GeoCode {
        lat: number;
        long: number;
    }

    export interface Hotel {
        id: string;
        rate: Rate;
        isRecommended?: boolean;
        moreRatesExpected: boolean;
        isRefundable?: any;
        freeBreakfast?: boolean;
        payAtHotel?: boolean;
        freeCancellation?: any;
        name: string;
        starRating?: number;
        address: string;
        distance?: number;
        heroImage: string;
        facilities: Facility[];
        geoCode: GeoCode;
        provider: string;
        userReview?: any;
        relevanceScore?: number;
        isSoldOut?: boolean;
        chainName: string;
        locationName?: any;
        propertyType: string;
        images: string[];
        amount:number;
        haram_distance:number;
    }

    export interface HotelRootObject {
        status: string;
        hotels: Hotel[];
        count: number;
        remaining_results: number;
    }

    export interface HotelNameList {
        name: string;
        code: number;
        umrah_hotel_code: number;
    }