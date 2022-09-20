import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-detail',
  templateUrl: './flight-detail.component.html',
  styleUrls: ['./flight-detail.component.scss']
})
export class FlightDetailComponent implements OnInit {

  isloading:boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
