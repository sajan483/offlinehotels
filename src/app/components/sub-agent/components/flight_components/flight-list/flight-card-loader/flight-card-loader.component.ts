import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-card-loader',
  templateUrl: './flight-card-loader.component.html',
  styleUrls: ['./flight-card-loader.component.scss'],
  animations: [
    trigger('upDownAnim', [
      transition(':enter', [
        style({
          height: 0
        }),
        animate(250, style({ height: '*' }))
      ]),
      transition(':leave', [
        style({ height: '*', transform: 'transalateY(0)' }),
        animate(250, style({ height: 0 }))
      ])
    ])
  ]
})
export class FlightCardLoaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
