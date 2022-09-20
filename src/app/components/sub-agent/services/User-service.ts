import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class UserStateService {
    private currencyArray:any[] = []
    globelCurrency = new BehaviorSubject("SAR");
    globelDecimel = new BehaviorSubject(2);
    globelRate = new BehaviorSubject(1);
    globalLanguage = new BehaviorSubject('en-US');
    globalLanguageName = new BehaviorSubject('ENGLISH');
    isTermsRailActive = new BehaviorSubject(false);
    isFlightHdrActive = new BehaviorSubject(false)
    selector = new BehaviorSubject('flight')

    constructor() { }

    public set currency(value){
        this.currencyArray = value;
    }

    public get currency(){
        return this.currencyArray;
    }
}
