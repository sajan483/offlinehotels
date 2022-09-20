import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-roomdetails-popup',
  templateUrl: './roomdetails-popup.component.html',
  styleUrls: ['./roomdetails-popup.component.scss']
})

export class RoomdetailsPopupComponent implements OnInit{
  showHotelDetails:boolean
  @Input() setViewData:any;
  @Output() showHotelDetailsEmitter = new EventEmitter();
  ngOnInit() {
    this.showHotelDetails=true
  }

  /*
 * this method for hide room details popup
 */
  hideRoomDetailsPopUp(){
    this.showHotelDetails =false
    this.showHotelDetailsEmitter.emit('hide');
  }
}