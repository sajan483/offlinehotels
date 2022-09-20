import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.scss']
})
export class RoomDetailsComponent implements OnInit {

  @Input() setViewData:any;
  @Input() currency:any;
  @Output() closePopUp = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log(this.setViewData);
    
  }

  close(){
    this.closePopUp.emit();
  }
}
