export interface LooseObject {
  [key: string]: any;
}

export interface Travellers {
  adults: number;
  children?: number;
  infants?: number;
}

export interface Room{
    adults: number;
    children: number;
    child_ages: string[];
    id: number;
    pax_info_str:string;
    seq_no:string;
}

export interface Day{
  value: number;
  valuenight: string;
}

export interface userObject{
  madeenaCheckinDate: Date;
  madeenaCheckoutDate: Date;
  makkahCheckinDate: Date;
  makkahCheckoutDate: Date;
  travallersCount: number;
  transportStartDate: Date;
  transportRoute: any;
}

export interface VisaObject {
  id: number;
  country: string;
  details: string;
  price: number;
  title: string;
  processing_days: number;
  validity_weeks: number;
  active: boolean;
  travellers: Travellers;
}

export interface hotelGallerImages{
  hotelName : string;
  rating : string;
  images : string[];
}
