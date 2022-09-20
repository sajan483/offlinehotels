import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader-hotel-details',
  templateUrl: './loader-hotel-details.component.html',
  styleUrls: ['./loader-hotel-details.component.scss']
})
export class LoaderHotelDetailsComponent implements OnInit {

  @Input() hotelShimmer:boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
