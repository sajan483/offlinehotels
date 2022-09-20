import { Component, OnDestroy, OnInit } from '@angular/core';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { AppStore } from 'src/app/stores/app.store';
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  superAgentApiService:SuperAgentApiService;
  branch:any;
  shimmer:boolean=true;

  constructor(private _SuperAgentService:SuperAgentApiService,private appStore:AppStore,public router: Router) {
    this.superAgentApiService=this._SuperAgentService;
   }

  ngOnInit() {
    this.branchList();
  }

  /**
   * API calling for Branch list
   */
  branchList(){
    this.superAgentApiService.getBranchlist(this.appStore.langCode).pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.branch=data;
      this.shimmer=false;
    })
  }

  navigateAddBranch(){
    this.router.navigate(['/superagent/create_branch'])
  }

  navigateUpdatebranch(id){
    this.router.navigate(['/superagent/update_branch',id])
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  }

}