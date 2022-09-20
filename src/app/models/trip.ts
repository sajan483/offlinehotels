export interface Links {
    next?: any;
    previous?: any;
}

export interface Result {
    id: number;
    start_date: string;
    num_days: number;
    starting_airport: string;
    owner_name: string;
    title: string;
    adult_price: number;
}

export interface RootObject {
    links: Links;
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    results: Result[];
}