
export interface Links {
    next: string;
    previous?: any;
}

export interface Agency {
    id: number;
    code: string;
    name: string;
}

export interface Result {
    id: number;
    agency: Agency;
    name: string;
    address: string;
    longitute?: any;
    latitude?: any;
    phone_number: string;
    email: string;
    state: string;
    city: string;
    active: boolean;
    instructions: string;
}

export interface RootObject {
    links: Links;
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    results: Result[];
}


