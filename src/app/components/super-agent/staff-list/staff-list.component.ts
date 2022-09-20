import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { AppStore } from 'src/app/stores/app.store';
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  superAgentApiService:SuperAgentApiService;
  staffList:any;
  shimmer:boolean = true;
  activePage: number;
  totalPage: number;
  currentPage: number;

  constructor(private _SuperAgentService:SuperAgentApiService,private appStore:AppStore,private route:Router) {
    this.superAgentApiService=this._SuperAgentService;
   }

  ngOnInit() {
    this.paginateStaffList(1);
  }

  paginateStaffList(pageNumber:number){
    this.superAgentApiService.getPaginatedStaffList(pageNumber,this.appStore.langCode).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.staffList = data.results;
      this.totalPage = data.total_pages;
      this.currentPage = data.page;
      this.shimmer = false;
    })
  }

  navigate(){
    this.route.navigate(['/superagent/staff_creation'])
  }

  displayActivePage(activePageNumber: number) {
    this.activePage = activePageNumber;
    if(activePageNumber < this.totalPage - 1){
      this.paginateStaffList(this.activePage);
    }
    this.activePage == 0;
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }

}