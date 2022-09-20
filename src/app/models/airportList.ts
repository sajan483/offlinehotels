export interface airportList{
    id:number;
    name:string;
    address:string;
    state:string;
    city:string;
    airport_type:string;
    iata:string;
    country:string;
}
export interface Country {
    code: number;
    iso_code: string;
    name: string;
    short_iso_code: string;
}