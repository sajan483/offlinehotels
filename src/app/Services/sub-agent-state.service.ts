import { Injectable } from "@angular/core";
import { HotelFilterModel } from '../models/hotel_filter_model'

@Injectable(
)
    
export class SubAgentStateService {
    
    constructor() { }
    
    private filterModel: HotelFilterModel;

    public set FilterModel(val: HotelFilterModel) {
        this.filterModel = val;
    }
    public get FilterModel(): HotelFilterModel {
        return this.filterModel;
    }

}