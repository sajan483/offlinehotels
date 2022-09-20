import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotel-loader',
  templateUrl: './hotel-loader.component.html',
  styleUrls: ['./hotel-loader.component.scss']
})
export class HotelLoaderComponent implements OnInit {

  freeArray = ["1","2","3","4"];

  constructor() { }

  ngOnInit() {
  }

}
