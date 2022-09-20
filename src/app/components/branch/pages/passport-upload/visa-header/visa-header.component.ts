import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-visa-header',
  templateUrl: './visa-header.component.html',
  styleUrls: ['./visa-header.component.scss']
})
export class VisaHeaderComponent implements OnInit {
  @Input() referencrNo:number; 

  constructor() { }

  ngOnInit() {
  }

}
