export interface FareSummary {
    is_total: boolean;
    name: string;
    amount: number;
    currency: string;
    actual_amount: number;
    actual_currency: string;
    display_price:number;
}

export interface Category {
    category_code: string;
    model: string;
    available_quantity: number;
    capacity: number;
    fare_summary: FareSummary[];
    additional_services: any[];
}

export interface VehicleType {
  vehiclePaxCount: number;
  active:boolean;
  vehicleCapacityCount: number;
    transport_amount: number;
    vehicle_count: number;
    count: number;
    vehicle_type_code: string[];
    vehicle_type_name: string[];
    terms_and_conditions?: any;
    image?: any;
    categories: Category[];
    toggle:boolean;
    toggle_vehicle: boolean;
}

export interface Transportation {
    totalCount: number;
    company_code: string;
    route_code: string;
    start_date: Date;
    terms_and_conditions?: any;
    vehicle_types: VehicleType[];
    available_vehicle_types: VehicleType[];
    policies: any[];
}

export interface VehicleTransport {
    transportations: Transportation[];
}
