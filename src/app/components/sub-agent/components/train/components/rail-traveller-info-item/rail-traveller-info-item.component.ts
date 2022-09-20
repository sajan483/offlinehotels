import { Component, Input, OnInit, Output ,EventEmitter} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rail-traveller-info-item',
  templateUrl: './rail-traveller-info-item.component.html',
  styleUrls: ['./rail-traveller-info-item.component.scss']
})
export class RailTravellerInfoItemComponent implements OnInit {
  gender = 'male'
  @Input()
  index;
  @Input()
  title;
  @Input()
  nationalities = []
  @Input()
  documents = [];
  @Input()
  isEditable = true;
  @Input()
  travellerForm;
  @Output()
  onRemove = new EventEmitter();
  @Input()
  isHidden = true;

  constructor() { }

  ngOnInit() {
    console.log(this.isEditable);
  }



  get f(){
    return this.travellerForm.controls;
  };

  setGender(gender){
    (this.travellerForm as FormGroup).patchValue({
      'gender':gender
    });
  }

  removeTraveller(){
    this.onRemove.emit(this.index);
  }

  toggle(){
    this.isHidden = !this.isHidden
  }
}
