import { Component, OnInit } from '@angular/core';
import { SubAgentApiService } from 'src/app/Services/sub-agent-api-services';
import { TranslateService } from '@ngx-translate/core';
import { HelperService } from "src/app/common/services/helper-service";
import { NotificationService } from 'src/app/common/services/notification.service';
import { HedderComponent } from 'src/app/common/components/hedder/hedder.component';
import { SubAgentGeneralHelper } from 'src/app/helpers/sub-agent/general-helper';
@Component({
  selector: 'app-booking-requests',
  templateUrl: './booking-requests.component.html',
  styleUrls: ['./booking-requests.component.scss']
})
export class BookingRequestsComponent implements OnInit {
  shareLinkDatas:any[]=[];
  companies:any[]=[];
  shimmer:boolean = true;
  productType:any = "";
  company:any = "";
  rquestDate:any="";
  travelDate:any="";
  dummyShareLinkDatas: any;
  currency: string = "";
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);

  constructor(private commonApiService:SubAgentApiService,
    private translate: TranslateService,
    public helper:HelperService,
    private notifyService:NotificationService) { }

  ngOnInit() {
    this.getShareLinks()
  }

  getShareLinks(){
    this.commonApiService.getShareLinks().subscribe(data =>{
      this.shareLinkDatas = data.data;
      this.dummyShareLinkDatas = data.data;
      this.shimmer = false;
      this.dataset(this.shareLinkDatas)
    })
  }

  copyBrn(val){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.notifyService.showSuccess(this.translate.instant("Copied successfully"));
  }

  dataset(data){
    data.forEach(element => {
      this.companies.push(element.shared_from)
    });
    this.companies =  [...new Set(this.companies)];
  }

  currencyConversion(amount) {
    return this.subagentHelper.currencyCalculation(amount)
  }

  viewBook(data){
    sessionStorage.setItem('disableShareBtn',"true");
    window.open(data,'_self')
  }

  dateConver(date){
    return new Date(date)
  }

  reservationReset(){
    this.productType = "";
    this.company = "";
    this.travelDate = "";
    this.rquestDate = "";
    this.shareLinkDatas = this.dummyShareLinkDatas;
  }

  filterReservation(){
    this.shareLinkDatas=[];
    var prodFilter = [];
    var companyFilter = [];
    var travelDateFilter = [];
    var reqstFilter = [];
    if(this.productType != ""){
      this.dummyShareLinkDatas.forEach(data =>{
        if(data.tags.length > 0 && data.tags[0].step != undefined && data.tags[0].step != null){
          if(data.tags[0].step == this.productType){
            prodFilter.push(data);
          }
        }
      })
      // prodFilter = this.dummyShareLinkDatas.filter(x =>x.tags[0].step == this.productType );
    }else{
      prodFilter = this.dummyShareLinkDatas;
    }
    if(this.company != ""){
      companyFilter = prodFilter.filter(x => x.shared_from == this.company );
    }else{
      companyFilter = prodFilter;
    }
    if(this.travelDate != ""){
      companyFilter.forEach(data =>{
        if(data.tags.length > 0 && data.tags[0].start_date != undefined && data.tags[0].start_date != null){
          var date1 = new Date(this.dateMDY(this.travelDate[0])).getTime();
          var date2 = new Date(this.dateMDY(data.tags[0].start_date)).getTime();
          var date3 = new Date(this.dateMDY(this.travelDate[1])).getTime();
          if(date1 <= date2 && date3 >= date2){
            travelDateFilter.push(data)
          }
        }
        
      })
      // if(this.travelDate[0].getTime() == this.travelDate[1].getTime()){
      //   console.log(new Date(this.dateMDY(this.travelDate[0])).getTime());
      //   console.log(new Date(this.dateMDY(this.dummyShareLinkDatas[1].tags[0].start_date)).getTime());
        
      //   travelDateFilter = companyFilter.filter(x => new Date(this.dateMDY(this.travelDate[0])).getTime() == new Date(this.dateMDY(x.tags[0].start_date)).getTime())
      // }else{
      //   travelDateFilter = companyFilter.filter(x => new Date(this.dateMDY(this.travelDate[0])).getTime() <= new Date(this.dateMDY(x.tags[0].start_date)).getTime() && new Date(this.dateMDY(this.travelDate[1])).getTime() >= new Date(this.dateMDY(x.tags[0].start_date)).getTime())
      // }
      
    }else{
      travelDateFilter = companyFilter
    }
    if(this.rquestDate != ""){
      travelDateFilter.forEach(data =>{
        if(data.tags.length > 0 && data.tags[0].request_date != undefined && data.tags[0].request_date != null){
          var date1 = new Date(this.dateMDY(this.rquestDate[0])).getTime();
          var date2 = new Date(this.dateMDY(data.tags[0].request_date)).getTime();
          var date3 = new Date(this.dateMDY(this.rquestDate[1])).getTime();
          if(date1 <= date2 && date3 >= date2){
            reqstFilter.push(data)
          }
        }
      })
      // reqstFilter = travelDateFilter.filter(x => this.rquestDate[0].getTime() <= new Date(x.tags[0].request_date).getTime() && this.rquestDate[1].getTime() >= new Date(x.tags[0].request_date).getTime())
    }else{
      reqstFilter = travelDateFilter
    }
    this.shareLinkDatas = reqstFilter;
  }

  dateMDY(date){
    date = new Date(date);
    return this.helper.dateFormaterMdy(date)
  }

  downloadVoucher(pdf_voucher){
    window.open(pdf_voucher,'_blank')
  }
  ngDoCheck(){
    this.currency = sessionStorage.getItem('currency');
  }

  makeDownloadVoucherTrue(tripId){
    var data = {"tripshare_id":tripId}
    this.commonApiService.makeDownloadLinkTrue(data).subscribe(data =>{
      this.getShareLinks();
    })
  }

}