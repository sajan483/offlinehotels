export interface GeoCode {
        lat: number;
        long: number;
    }

    export interface Address {
        line1: string;
        line2?: any;
        destinationCode?: any;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    }

    export interface Contact {
        address: Address;
        phones: string[];
        faxes?: any;
        emails?: any;
        website?: any;
    }

    export interface Description {
        type: string;
        text: string;
    }

    export interface FacilityGroup {
        id: number;
        groupId: number;
        name: string;
    }

    export interface Facility {
        id: number;
        groupId: number;
        name: string;
    }

    export interface NearByAttraction {
        name: string;
        distance: string;
        unit: string;
        description?: any;
        type?: any;
    }

    export interface Image {
        caption: string;
        category?: any;
        type?: any;
        roomCodes: string[];
        size: string;
        url: string;
    }

    export interface Fee {
        type?: any;
        text: string;
    }

    export interface Review {
        provider: string;
        count: number;
        rating: number;
        url?: any;
        reviews?: any;
    }

    export interface CheckinInfo {
        beginTime: string;
        endTime: string;
        instructions: string[];
        specialInstructions: any[];
        minAge: number;
    }

    export interface CheckoutInfo {
        time: string;
    }

    export interface Providers {
        provider: string,
        vendor: string,
        hotel_code: string,
        amount: number,
        currencyCode: string
    }

    export interface SelectedHotel {
        id: string;
        city:string;
        name: string;
        relevanceScore: number;
        providerFamily: string;
        providerHotelId: string;
        language?: any;
        providerName: string;
        geoCode: GeoCode;
        neighbourhoods: any[];
        contact: Contact;
        chainCode: string;
        chainName: string;
        type: string;
        website?: any;
        descriptions: Description[];
        category: string;
        starRating: number;
        facilityGroups: FacilityGroup[];
        facilities: Facility[];
        nearByAttractions: NearByAttraction[];
        images: Image[];
        policies: any[];
        fees: Fee[];
        reviews: Review[];
        checkinInfo: CheckinInfo;
        checkoutInfo: CheckoutInfo;
        heroImage: string;
        distance: number;
        locationName?: any;
        search: string;
        hotel_name: string;
        umrah_hotel_code: string;
        location_code:string;
        providers:Providers[];
    }

    export interface SelectedHotelObject {
        hotel: SelectedHotel;
        status: string;
    }
    
