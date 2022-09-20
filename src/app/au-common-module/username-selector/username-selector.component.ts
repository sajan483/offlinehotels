import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-username-selector',
  templateUrl: './username-selector.component.html',
  styleUrls: ['./username-selector.component.scss']
})
export class UsernameSelectorComponent implements OnInit {
  @Input()
  credentials = [];
  @Output()
  onCredentialSelected:EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  onCredentialSelect(credential){
    this.credentials.forEach((co)=>{
      if(credential.username!=co.username)
        co.checked = false;
    });
    
    credential.checked = !credential.checked;
    this.onCredentialSelected.emit(credential)
  }

}
