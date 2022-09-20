import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject()
  accountHistory:any;
  startDate: string;
  endDate: string;
  convertStartDate: string;
  convertEndDate: string;
  today = new Date().toJSON().split("T")[0];
  isFound: any;
  balance: any;
  showSpinner:boolean = true;
  superAgentApiService:SuperAgentApiService;

  constructor(private datepipe: DatePipe, private appStore: AppStore,private _SuperAgentService:SuperAgentApiService) { 
    this.superAgentApiService=this._SuperAgentService;
  }

  ngOnInit() {
    this.showSpinner = true;
    this.getAccoundHistory();
  }

  /**
   * this method is used for get accound history and balance
   */
  getAccoundHistory(){
    this.superAgentApiService.getAccountHistory().pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
      this.isFound = response.Response.ResponseDescription;
      this.accountHistory = response.ResponseDeatils.AccountStatment;
      this.showSpinner = false;
    })
  }

  /**
   * this method is used for search history in date vice
   */
  setSearchDate(){
    this.showSpinner = true;
    this.startDate = (<HTMLInputElement>document.getElementById("historydate_input")).value.split(" - ")[0];
    this.endDate = (<HTMLInputElement>document.getElementById("historydate_input")).value.split(" - ")[1];
    this.convertStartDate = this.datepipe.transform(this.startDate, "yyyy-MM-dd");
    this.convertEndDate = this.datepipe.transform(this.endDate, "yyyy-MM-dd");
    if(this.startDate && this.endDate){
      this.superAgentApiService.getAccountDateHistory(this.convertStartDate,this.convertEndDate).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
        this.isFound = response.Response.ResponseDescription;
        this.accountHistory = response.ResponseDeatils.AccountStatment;
        this.showSpinner = false;
      })
    }
    else{
      this.getAccoundHistory();
    }
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
 }
 
}
