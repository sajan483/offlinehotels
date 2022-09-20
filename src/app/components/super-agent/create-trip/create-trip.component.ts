import { Component, OnInit } from '@angular/core';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { Router } from '@angular/router';
import { AppStore } from 'src/app/stores/app.store';
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.scss']
})
export class CreateTripComponent implements OnInit {
  homePage:boolean = true;
  private destroy$ = new Subject();
  constructor(
    private commonService: SuperAgentApiService,
    private router: Router,
    private appStore:AppStore) { }

  ngOnInit() {
    sessionStorage.removeItem('selector');
    sessionStorage.removeItem('packageId');
    sessionStorage.removeItem('masterPackageId');
    sessionStorage.removeItem('packageEdit');
    sessionStorage.removeItem('published');
    sessionStorage.removeItem('packageEdit')
  }

  createPackage(value){
    sessionStorage.removeItem('hotelDetails');
    sessionStorage.removeItem('modify');
    let data = {
      "max_passengers":value.travellersData.adult,
      "no_of_days":value.travellersData.packageDays
    }
    this.commonService.createPackage(data,sessionStorage.getItem('currency'),'en-US').pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
      this.appStore.packageId = data.id;
      sessionStorage.setItem('packageId',data.id);
      this.router.navigateByUrl('superagent/stepper');
    })
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  }
  
}