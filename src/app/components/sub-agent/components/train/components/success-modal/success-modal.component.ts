import { Component, EventEmitter, OnInit, Output,Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss']
})
export class SuccessModalComponent implements OnInit {
  @Input()
  showModal: boolean =false;
  @Output() bookHotelPopupClose = new EventEmitter()
  Evisa: boolean;
  availableStartDate: Date;
  @Input()
  utNo = '';
  @Output()
  onHideModal= new EventEmitter();

  constructor() {

     }

  ngOnInit() {
  }


  hide() {
    this.onHideModal.emit();
  }


}
