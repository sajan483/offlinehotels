import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { listHistory } from '../../../../models/listHistory';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { GeneralHelper } from 'src/app/helpers/General/general-helpers';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { SubAgentCurrencyLangHelper } from '../../helpers/currency-lang-helper';
import { UserStateService } from '../../services/User-service';
import { ApiServiceSubAgent } from '../../services/api-service-sub-agent';


@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss']
})

export class BookingHistoryComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  activePage: number;
  currentPage: number;
  totalPage: number;
  pageNo: number;
  pageSize: number;
  history: listHistory;
  prodUrl: string = "";
  baseUrl: string = environment.prodUrl;
  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userStateService,this.translate);
  selectLangCode:any;
  selectCurrency:any;
  shimmer:boolean = true;
  searchValue: any = '';
  popupShow: boolean = false;

  constructor(private paymentLoader: NgxSpinnerService, private common: ApiServiceSubAgent, private router: Router,
    private userStateService: UserStateService,private translate: TranslateService,private activeRoute:ActivatedRoute,
    private genHelper: GeneralHelper) { }

  /**
   * this methode is used for user is logged or not
   */
  ngOnInit(): void {
    this.getLanguage();
  }

  getLanguage(){
    this.activeRoute.params.subscribe(params =>{
      this.currencyLangHelper.changeLanguage(params.lang);
      this.currencyLangHelper.setCurrency(params.currency);
    })
    this.initialValues();
  }

  initialValues(){
    this.userStateService.globelCurrency.subscribe(t => this.selectCurrency = t);
    this.userStateService.globalLanguage.subscribe(t => this.selectLangCode = t);
    var pageno = sessionStorage.getItem('bookingPageNumber')?sessionStorage.getItem('bookingPageNumber'):1;
    this.paginateHistoryList(+pageno);
    this.genHelper.checkForAccessToken();
    this.findProdUrlConfig()
    this.setUserDataForSegmentAnalysis()
  }

  setUserDataForSegmentAnalysis(){
    if(this.baseUrl  == this.prodUrl){
       window.analytics.page('subagent/transations',{
        portal:"B2B"
      });
    }
  }

findProdUrlConfig(){
    const parsedUrl = new URL(window.location.href);
       this.baseUrl = parsedUrl.origin;
  }


  /**
   * API calling for history list
   * @param activePage 
   */
  paginateHistoryList(activePage: number) {
    var page:any = activePage;
    this.shimmer = true;
    this.common.getPaginatedhistoryList(activePage,this.selectLangCode,this.searchValue).pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.pageNo = response.page;
      this.pageSize = response.page_size;
      this.history = response.results;
      this.totalPage = response.total_pages;
      this.currentPage = response.page;
      this.shimmer = false;
    })
  }

  searchData(event){
    this.searchValue = event;
    this.paginateHistoryList(1);
    this.popupShow = false;
  }

  /**
   * this methode used for navigate history view page
   * @param id 
   */
  viewhistory(id: any) {
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('view history',{
      portal:"B2B",
      selectedId:id
     });
    }
    this.router.navigate(["/payment", id, "history"]);
  }

  navigateToReportGenerationPage(){
    this.router.navigate(["/subagent/report"]);
  }
  
  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }
 
   showFilter(){
     this.popupShow = true;
   }

   closeFilter(){
    this.popupShow = false;
   }
}