import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-hotel-sort',
  templateUrl: './hotel-sort.component.html',
  styleUrls: ['./hotel-sort.component.scss']
})
export class HotelSortComponent implements OnInit {

  @Input() city:any;
  @Output() sortData = new EventEmitter();
  sortText:string = "My favorites"
  @Input() isMobile:boolean = false;

  constructor() { }

  ngOnInit() {
  }

  setDortList(id:number,text:string){
    this.sortText = text;
    this.sortData.emit(id);
  }

}
