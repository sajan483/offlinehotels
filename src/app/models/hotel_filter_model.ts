export interface HotelFilterModel {
    StarRating: HotelFilterModelStarRating[];
    Amenities: HotelFilterModelAmenities[];
    FilterApplied: boolean;
    MinPrice: number;
    MaxPrice: number;
}

export class HotelFilterModelStarRating{
    Type: number;
    Tounched: boolean = false;
}

export class HotelFilterModelAmenities{
    Name: String;
    Tounched: boolean = false;
}
