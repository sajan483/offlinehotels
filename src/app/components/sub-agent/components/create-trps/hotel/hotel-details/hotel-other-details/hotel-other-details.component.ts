import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotel-other-details',
  templateUrl: './hotel-other-details.component.html',
  styleUrls: ['./hotel-other-details.component.scss']
})
export class HotelOtherDetailsComponent implements OnInit {

  @Input() selectedHotel:any;

  constructor() { }

  ngOnInit() {
  }

}
