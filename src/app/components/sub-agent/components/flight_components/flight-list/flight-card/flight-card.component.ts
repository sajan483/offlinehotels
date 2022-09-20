import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UserStateService } from 'src/app/components/sub-agent/services/User-service';

@Component({
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.scss'],
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
export class FlightCardComponent implements OnInit {
  @Input() flightList: any;
  @Input() isLoading: boolean = false;
  selectedOnwardFlight :any;
  selectedReturnFlight;
  onwardFlights = [];
  returnFlights = [];
  hasMoreOnward = false;
  hasMoreReturn = false;
  onwardFlightsVisible= [];
  returnFlightsVisible = [];
  onwardFlightsHidden = [];
  returnFlightsHidden = [];
  currency: any;
  showMoreOnward: boolean = false;
  showMoreReturn: boolean = false;
  isSticky: boolean = false;
  @ViewChild('stickyDiv', { static: false}) stickyDiv: any;
  @Output() onSelectFlight: EventEmitter<any>= new EventEmitter<any>();

  constructor(private userState:UserStateService) { }

  ngOnInit() {
    this.userState.globelCurrency.subscribe(data=>{this.currency = data})
    if(this.flightList){
      let onwardFlightIds = [];
      let returnFlightIds = [];
      this.flightList.forEach((e)=>{
        if(!onwardFlightIds.includes(e.id)){
        this.onwardFlights.push(e.onwardFlight);
        onwardFlightIds.push(e.id)
        }
        e.returnFlights.forEach((r)=>{
          if(!returnFlightIds.includes(r.id)){
            this.returnFlights.push(r);
            returnFlightIds.push(r.id);
          }
        });
        // this.returnFlights.push(...e.returnFlights);
      });

      if(this.onwardFlights.length>2){

        this.hasMoreOnward = true;
        this.onwardFlightsVisible = this.onwardFlights.slice(0,2);
        this.onwardFlightsHidden = this.onwardFlights.slice(2);
      }else{
        this.onwardFlightsVisible = this.onwardFlights;
        this.onwardFlightsHidden = [];
      }

      if( this.returnFlights.length>2){
        this.hasMoreReturn = true;
        this.returnFlightsVisible = this.returnFlights.slice(0,2);
        this.returnFlightsHidden = this.returnFlights.slice(2);
      }else{
        this.returnFlightsVisible = this.returnFlights;
        this.returnFlightsHidden = [];
      }

      this.selectedOnwardFlight = this.onwardFlights[0];
      this.selectedReturnFlight = this.returnFlights[0];
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
      if(this.stickyDiv.nativeElement.offsetTop > 0) {
        this.isSticky=true;
      } else {
        this.isSticky=false;
      }
  }

  onOnwardChanged(flight){
    this.selectedOnwardFlight = flight;
  }
  onReturnChanged(flight){
    this.selectedReturnFlight = flight;
  }

  onShowMoreOnward() {
    this.showMoreOnward = !this.showMoreOnward;
  }
  onShowMoreReturn() {
    this.showMoreReturn = !this.showMoreReturn;
  }
  onBook(famount){
    this.onSelectFlight.emit({
      total:famount,
      onwardFlight:this.selectedOnwardFlight,
      returnFlight:this.selectedReturnFlight
    })
  }

}
