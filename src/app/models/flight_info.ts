export interface Info {
  AdultAmount: string;
  ChildAmount: string;
  InfantAmount: string;
  Description: string;
}

export interface Rules {
  Info: Info[];
  Head: string;
}

export interface FareRule {
  OrginDestination: string;
  FUID: string;
  Provider: string;
  FareRuleText?: any;
  Rule: Rules[];
}

export interface SegmentFlight {
  FUID: number;
  VAC: string;
  MAC: string;
  OAC: string;
  FBC: string;
  Airline: string;
  FlightNo: string;
  ArrivalTime: Date;
  DepartureTime: Date;
  FareClass: string;
  ArrivalCode: string;
  DepartureCode: string;
  ArrivalTerminal: string;
  DepartureTerminal: string;
  ArrAirportName: string;
  DepAirportName: string;
  EquipmentType: string;
  RBD: string;
  Cabin: string;
  Refundable: string;
  Amenities: string;
  Seats: number;
  Hops: any[];
  Duration: string;
  AirCraft: string;
}

export interface PTCFare {
  PTC: string;
  Fare: number;
  YQ: number;
  PSF: number;
  YR: number;
  UD: number;
  K3: number;
  API: number;
  OTT: string;
  OT: string;
  Tax: number;
  GrossFare: number;
  NetFare: number;
  ST: number;
  VATonServiceCharge: number;
  VATonTransactionFee: number;
}

export interface Fares {
  PTCFare: PTCFare[];
  GrossFare: number;
  NetFare: number;
  TotalServiceTax: number;
  TotalBaseFare: number;
  TotalTax: number;
  TotalCommission: number;
  TotalVATonServiceCharge: number;
  TotalVATonTransactionFee: number;
}

export interface Segment {
  Flight: SegmentFlight;
  Fares: Fares;
}

export interface FlightDetail {
  Provider: string;
  Stops: string;
  OrderID: number;
  GrossFare: number;
  NetFare: number;
  Duration: string;
  Promo: string;
  Segments: Segment[];
  Notices: any[];
}

export interface SSR {
  Code: string;
  FUID: string;
  Description: string;
  PieceDescription: string;
  Charge: number;
  VAT: number;
  Type: string;
  Category: string;
  PTC: string;
  ID: number;
  IsFreeMeal: boolean;
  MealImage: string;
  SSRUrl?: any;
}

export interface SSRSegment {
  FUID: string;
  VAC: string;
  Index?: any;
  SSR: SSR[];
}

export interface Journey {
  Provider: string;
  MultiSSR: string;
  ConversationID: string;
  Segments: SSRSegment[];
}

export interface FlightTrip {
  From: string;
  To: string;
  Journey: Journey[];
}

export interface SSRObject {
  TUI: string;
  PaidSSR: boolean;
  Trips: FlightTrip[];
}

export interface FlightInfoObject {
  TUI: string;
  From: string;
  To: string;
  FromName: string;
  ToName: string;
  OnwardDate: string;
  ReturnDate: string;
  ADT: number;
  CHD: number;
  INF: number;
  NetAmount: number;
  GrossAmount: number;
  InsPremium: number;
  FareType: string;
  Hold: boolean;
  Rules: FareRule[];
  SSR: SSRObject[];
  IsPrivateFare: boolean;
  CeilingInfo: string;
  flight_details: FlightDetail[];
}
