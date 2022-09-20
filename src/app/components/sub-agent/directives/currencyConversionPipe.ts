import { Pipe, PipeTransform } from '@angular/core';
import { UserStateService } from '../services/User-service';

@Pipe({name: 'ConvertCurrency'})

export class ConvertCurrency implements PipeTransform {
    globelDecimel:number = 2;
    globelRate:number = 1;
    constructor(private userState:UserStateService){}
     
    transform(amt: any,currency): any {
        this.userState.globelRate.subscribe(value => {this.globelRate = +value;});
        this.userState.globelDecimel.subscribe(value => {this.globelDecimel = value;});
        return (Math.round((amt * this.globelRate) * 100) / 100).toFixed(this.globelDecimel);
    }
}