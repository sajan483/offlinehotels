import { Injectable } from '@angular/core';
import { observable } from "mobx-angular";
import { Room } from '../models/visaTypes';

@Injectable({
  providedIn: 'root'
})
export class AppStore {
  @observable currencyCode: string = 'SAR';
  @observable adultCount: number;
  @observable childCount: number;
  @observable infantCount : number;
  @observable totalTravellers : number;
  @observable stepperIndex : number;
  @observable currentUser : string;
  @observable langCode: string = 'en-US';
  @observable stepsArray:string[];
  @observable roomArray:Room[];
  @observable userDetails:any;
  @observable transportSearchId:any;
  @observable vehicleMax:number;
  @observable showRoomAlPopup:boolean;
  @observable showHotelDetails:boolean;
  @observable showShimmer:boolean;
  @observable makkahSearchId:any;
  @observable madinahSearchId:any;
  @observable showHotelDetailsShimmer: boolean;
  @observable noOfDaysInMakkah:number;
  @observable noOfDaysInMadeena:number;
  @observable isAvailabilityFails:boolean;
  @observable tui:any;
  @observable packageId:number;
  @observable dataFromFrontPage:any;
  @observable userType:any;
  @observable departureDate:any;
  @observable arrivalDate:any;
  @observable makkahCheckInDate:any;
  @observable makkahCheckOutDate:any;
  @observable medinahCheckInDate:any;
  @observable medinahCheckOutDate:any;
  constructor() { }
}