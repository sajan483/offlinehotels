import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { SubAgentCurrencyLangHelper } from '../../../helpers/currency-lang-helper';
import { TrainService } from '../../../services/train.service';
import { UserStateService } from '../../../services/User-service';

@Component({
  selector: 'app-train-itinery',
  templateUrl: './train-itinery.component.html',
  styleUrls: ['./train-itinery.component.scss']
})
export class TrainItineryComponent implements OnInit {
  count: any;
  details: any;
  detailsShimmer: boolean = true;
  listShimmer: boolean = true;
  currentPage: number = 1;
  selectedBookingPage = 1;
  currency = 'SAR';
  totalPage: number = 1;
  private destroy$ = new Subject();
  railBookings: any;
  selectLang:any;
  selectLangCode:any;
  languageOptions : any = [ {lang:'ar-AE',langName:'العربية'},{lang:'en-US',langName:'ENGLISH'}];
  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userState,this.translate);
  shimmer:boolean = true;

  constructor(private translate: TranslateService, private route: Router,private activeRoute:ActivatedRoute,
    private userState: UserStateService, private trainService: TrainService) { }

  ngOnInit() {
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
    this.userState.globelCurrency.subscribe(t => this.currency = t);
    this.userState.globalLanguage.subscribe(t => this.selectLangCode = t);
    this.getRailBookings(this.currentPage);
  }



  /**
   * This method for view itinery page navigation
   * @param id the booking id
   */
  viewDetails(id) {
    this.route.navigate(['subagent/train_booking/'+id+"/"+this.selectLangCode+"/"+this.currency]);
  }

  ngOnDestroy() {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

  getRailBookings(page) {
    this.shimmer = true;
    this.trainService.getTrainBookings(page).subscribe((data: any) => {
      this.shimmer = false;
      this.railBookings = data;
      this.totalPage = data.total_pages;
      this.currentPage = data.page;
      this.listShimmer = false;
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.getRailBookings(this.currentPage - 1)
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPage) {
      this.getRailBookings(this.currentPage + 1)
    }
  }
//

}
