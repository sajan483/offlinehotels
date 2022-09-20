import { Component, Input, OnInit } from '@angular/core';
import { HelperService } from 'src/app/common/services/helper-service';
import { FlightComponent } from '../flight.component';

@Component({
  selector: 'app-flight-footer',
  templateUrl: './flight-footer.component.html',
  styleUrls: ['./flight-footer.component.scss'],
  providers:[]
})
export class FlightFooterComponent implements OnInit {

  @Input() footerData:any;
  currency: string;

  constructor(private flight:FlightComponent,private helper:HelperService) { }

  ngOnInit() { 
    this.currency = sessionStorage.getItem('currency')
  }

  currencyConversion(amount){
    return this.helper.priceConversion(amount);
  }

  navigateFareSelection(){
    if(this.footerData.retFlight.From && this.footerData.depFlight.From){
      this.flight.navigateFareSelection()
    }
  }

}