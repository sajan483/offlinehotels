export interface Links {
    next?: any;
    previous?: any;
}

export interface VehicleResult {
    id: number;
    ground_transport_name: string;
    vehicle_category: string;
    price_per_person: number;
    capacity: number;
    vehicle_model: string;
    bag_capacity: number;
    description?: any;
    amenities: string;
    ground_transport: number;
}

export interface VehicleObject {
    links: Links;
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    results: VehicleResult[];
}



