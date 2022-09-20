import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-transport-sort',
  templateUrl: './transport-sort.component.html',
  styleUrls: ['./transport-sort.component.scss']
})
export class TransportSortComponent implements OnInit {

  sortText:string = 'Lower price first';
  @Input() countList:number = 0;
  @Output() sortData = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  setDortList(id:number,text:string){
    this.sortText = text;
    this.sortData.emit(id);
  }

}
