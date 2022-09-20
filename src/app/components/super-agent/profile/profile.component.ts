import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { takeUntil } from "rxjs/operators";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit,OnDestroy {
  superAgentApi:SuperAgentApiService;
  id:any;
  profile: any;
  private destroy$ = new Subject();

  constructor(private activeRoute:ActivatedRoute,private _siperAgentApi:SuperAgentApiService) { 
    this.superAgentApi = this._siperAgentApi;
  }

  ngOnInit() {
    this.getAgencyDetails();
  }

  getAgencyDetails(){
    this.id = this.activeRoute.params.pipe(takeUntil(this.destroy$)).subscribe((params:any) =>{
      this.id = params['id'];
      this.superAgentApi.getAgencyApprovedDetails(this.id).pipe(takeUntil(this.destroy$)).subscribe((res:any) =>{
        this.profile = res;
      })
    })
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }
}