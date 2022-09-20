import { Component, OnInit } from '@angular/core';
import { UserStateService } from 'src/app/components/sub-agent/services/User-service';

@Component({
  selector: 'app-rail-terms-conditions',
  templateUrl: './rail-terms-conditions.component.html',
  styleUrls: ['./rail-terms-conditions.component.scss']
})
export class RailTermsConditionsComponent implements OnInit {
  constructor(private userState:UserStateService) { }

  ngOnInit() {
  }

  close(){
    this.userState.isTermsRailActive.next(false)
  }

}
