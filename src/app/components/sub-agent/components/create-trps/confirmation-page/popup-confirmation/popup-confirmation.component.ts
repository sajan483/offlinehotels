import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/common/services/notification.service';
import { SubAgentGeneralHelper } from 'src/app/helpers/sub-agent/general-helper';
import { SubAgentApiService } from 'src/app/Services/sub-agent-api-services';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-popup-confirmation',
  templateUrl: './popup-confirmation.component.html',
  styleUrls: ['./popup-confirmation.component.scss']
})
export class PopupConfirmationComponent implements OnInit {

  accNo: any;
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);
  ibanValidation: boolean = false;
  ibanMessge: string;
  showibanList:boolean = false;
  @Input() isHotelSeclection:boolean;
  @Input() bookingData:any;
  @Input() currency:any;
  bookService: any;
  cancellationData: any[] = [];
  @Input() ibanNumberList:any[] = [];
  ibanTagName: any;
  saveBttnActive: boolean = false;
  private destroy$ = new Subject();
  authCode: any;
  lengthAuthCode: boolean = false;
  @Output() getPaymentData = new EventEmitter();

  constructor(private notifyService: NotificationService,private translate: TranslateService,
    private service:SubAgentApiService) { }

  ngOnInit() {
    this.setInitializeData()
  }

  setInitializeData(){
    if(this.isHotelSeclection){
      this.bookService = this.bookingData.makka_hotel_booking != null ? this.bookingData.makka_hotel_booking : this.bookingData.madina_hotel_booking;
      this.cancellationData = [];
      this.bookService.trip_hotel.room_variations.forEach(element => {
        this.cancellationData = this.cancellationData.concat(element.room)
      });
    }else{
      this.bookService = this.bookingData.transport_booking.trip_transportation;
      this.cancellationData = [];
      this.cancellationData = [this.bookingData.transport_booking.trip_transportation.selected_transportation.cancellation_policy];
    }
  }

  omit_special_char(event){
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  iBanNumberValidation(event){
    this.accNo = event;
    var test = this.subagentHelper.ibanTextValidation(this.accNo);
    if(test != 'true'){
      this.ibanValidation = true;
      this.ibanMessge = test;
      return;
    }else{ this.ibanValidation = false;}
  }

  showIbanList(){
    this.showibanList = !this.showibanList;
  }

  copyLinkB2b(val: string){
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

  selectIbanNumber(iban){
    this.accNo = iban.iban;
    this.ibanTagName = iban.tag;
    this.showibanList = false;
    this.iBanNumberValidation(iban.iban);
  }

  SaveIbanDat(){
    if(this.accNo && this.accNo != null){
      if(!this.ibanValidation){
        this.saveBttnActive = true;
        var body = {
          iban : this.accNo,
          tag : this.ibanTagName
        }
        this.service.addIbanNumber(body).pipe(takeUntil(this.destroy$)).subscribe(data =>{
          this.notifyService.showSuccess(this.translate.instant('saved'));
          this.saveBttnActive = false;
        })
      }
    }
  }

  onOtpChange(evt){
    this.authCode = evt;
    if(this.authCode.length == 6){
      this.lengthAuthCode = false;
    }
  }

  onSubmitButtonClicked(){
    if(this.accNo == null){
      this.ibanValidation = true;
      return
    }

    if(this.ibanValidation){
      return;
    }

    if(this.authCode != null && this.authCode.length == 6){ }else{
      this.lengthAuthCode = true;
      return;
    }

    let w = {
      "close":false,
      "account_no": this.accNo,
      "auth_code": this.authCode,
    }

    this.getPaymentData.emit(w);
  }

  closePopUp(){
    let w = {
      "close":true
    }

    this.getPaymentData.emit(w);
  }

}
