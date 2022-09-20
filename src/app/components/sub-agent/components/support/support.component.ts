import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  static supportChat:boolean;

  constructor() { }

  ngOnInit() {
  }

  close(){
    SupportComponent.supportChat = false;
  }

}
