export interface RouteList {
    item_text:string,
    item_id:string
}

export interface FilterCategoryTransport {
    code:      string;
    name:      string;
    checked:   boolean;
    roundTrip: boolean;
    mazarat:   boolean;
    meal:      boolean;
    count:     number;
}

export interface FilterVehicleTypeList {
    item_text:  string;
    item_id:    string;
    item_count: number;
    checked:    boolean;
}

export interface FilterVehicleModel {
    model:   string;
    count:   number;
    checked: boolean;
}

export interface FilterAdditionalServiceTransport{
    additional_service_code: string;
    description:             string;
    count:                   number;
    checked:                 boolean;
}

export interface TransportFilterData {
    category:           FilterCategoryTransport[];
    vehicle_type:       FilterVehicleTypeList[];
    vehicle_model:      FilterVehicleModel[];
    additional_service: FilterAdditionalServiceTransport[];
}

export interface TransportFilterPostData {
    category_id:            string[];
    vehicle_type_id:        string[];
    vehicle_model:          string[];
    additional_service_id:  string[];
}