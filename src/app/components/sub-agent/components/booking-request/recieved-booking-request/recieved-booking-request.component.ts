import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/common/services/notification.service';
import { SubAgentGeneralHelpers } from '../../../helpers/general-helpers';
import { ApiServiceSubAgent } from '../../../services/api-service-sub-agent';

@Component({
  selector: 'app-recieved-booking-request',
  templateUrl: './recieved-booking-request.component.html',
  styleUrls: ['./recieved-booking-request.component.scss']
})
export class RecievedBookingRequestComponent implements OnInit {

  @Input() currency:any;
  @Input() lang:any;
  shareLinkDatas:any[] = [];
  dummyShareLinkDatas: any[] = [];
  shimmer:boolean = true;
  companies:any[]=[];
  helper:SubAgentGeneralHelpers = new SubAgentGeneralHelpers(this.datepipe);
  productType:any = "";
  company:any = "";
  rquestDate:any="";
  travelDate:any="";
  @Input() isSearchData:boolean = true;
  isMobile:boolean = false;

  constructor(private apiService:ApiServiceSubAgent,private datepipe: DatePipe,private notifyService:NotificationService,
    private translate: TranslateService,private route:Router) { }

  ngOnInit() {
    if (window.innerWidth < 992) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.getBookingRqst();
  }

  getBookingRqst(){
    this.apiService.getShareLinks().subscribe((res)=>{
      this.shareLinkDatas = res.data;
      this.dummyShareLinkDatas = res.data;
      this.shimmer = false;
      this.dataset(res.data)
    })
  }

  dataset(data){
    data.forEach(element => {
      this.companies.push(element.shared_from_agency_name)
    });
    this.companies =  [...new Set(this.companies)];
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
      companyFilter = prodFilter.filter(x => x.shared_from_agency_name == this.company );
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

  makeDownloadVoucherTrue(tripId){
    var data = {"tripshare_id":tripId}
    this.apiService.makeDownloadLinkTrue(data).subscribe(data =>{
      this.getBookingRqst();
    })
  }

  randomKeyGenerator(length,service) {
    let key = new Date().getTime().toString();
    let result           = [];var x = "";
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));}
    x = service + result.join('') + key
    return x;
  }

  bookingView(data:any){
    let x,type
    if(data.tags[0].step == '1' || data.tags[0].step == '2'){
      x = this.randomKeyGenerator(5,'H');
      type = 'hotel';
    }else if(data.tags[0].step == '3'){
      x = this.randomKeyGenerator(5,'T');
      type = 'transport';
    }
    
    if(this.isMobile){
      this.route.navigate(
        ['/subagent/booking/'+this.lang+'/'+this.currency],
        { queryParams: { 
          type:type,
          tripId:data.trip,
          ulogId:x,
          isLink:true
        } }
      )
    }else{
      const url = this.route.serializeUrl(
        this.route.createUrlTree(
          ["/subagent/booking/"+this.lang+"/"+this.currency],
          { queryParams: { 
            type:type,
            tripId:data.trip,
            ulogId:x,
            isLink:true
          } }
        )
      );
      window.open(url, '_blank');
    }
  }

}
