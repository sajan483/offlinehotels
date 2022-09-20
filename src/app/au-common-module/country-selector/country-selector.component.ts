import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-country-selector',
  templateUrl: './country-selector.component.html',
  styleUrls: ['./country-selector.component.scss']
})
export class CountrySelectorComponent implements OnInit {
  @Input()
  countries = [];
  @Output()
  onCountrySelect:EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  onCountryChecked(country){
    this.countries.forEach((co)=>{
      if(country.name!=co.name)
        co.checked = false;
      
    });
    
    country.checked = !country.checked;
    this.onCountrySelect.emit(country)
  }

}
