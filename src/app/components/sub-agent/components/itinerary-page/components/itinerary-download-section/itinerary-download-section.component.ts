import { Component, Input, OnInit } from '@angular/core';
import { Http,Headers} from '@angular/http';
import { ApiServiceSubAgent } from 'src/app/components/sub-agent/services/api-service-sub-agent';
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject,timer } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import Swal from "sweetalert2";
import { LooseObject } from 'src/app/components/sub-agent/models/looseObjectModek';

@Component({
  selector: 'app-itinerary-download-section',
  templateUrl: './itinerary-download-section.component.html',
  styleUrls: ['./itinerary-download-section.component.scss']
})
export class ItineraryDownloadSectionComponent implements OnInit {

  @Input() downloadShow:boolean = false;
  invoicetoggle: boolean = false;
  vouchertoggle: boolean = false;
  reciepttoggle: boolean = false;
  cancellationtoggle: boolean = false;
  @Input() tripId:any;
  vatNumber:any = '';
  @Input() lang:any;
  @Input() tripData:any;
  @Input() currency:any;
  BaseUrl: string = environment.baseUrl;
  private destroy$ = new Subject();
  checkCancelData: LooseObject = {};
  checkCanResponse: boolean;
  pendingApiTimer = environment.pendingApiTime;
  canSubscription: any;
  cancelationPopup:boolean = false
  showVatPopup:boolean = false;
  invoiceActive:boolean = false;
  receptActive:boolean = false;

  constructor(private service:ApiServiceSubAgent,private http:Http,private translate: TranslateService) { }

  ngOnInit() {
    this.checkCancelData.details = this.tripData;
  }

  invoiceClickPdf() {
    if(!this.downloadShow){
      return;
    }
    this.invoicetoggle = true;

    let options = {
      headers: new Headers({
        "Content-Type": "text/html",
        Authorization: "Bearer " + sessionStorage.getItem("accesstoken"),
      }),
    };
    
    this.http.get(this.BaseUrl+"bookings/"+this.tripId+"/invoice_template/?vat_number="+this.vatNumber+"&lang="+this.lang,options).pipe(takeUntil(this.destroy$))
    .subscribe((data:any) => {
      this.invoicetoggle = false;
      this.print(data._body)
    },(error)=>{
      this.invoicetoggle = false;
      this.invoiceActive = true
      this.showVatPopup = true
    });
  }

  recieptClickPdf() {
    if(!this.downloadShow){
      return;
    }
    this.reciepttoggle = true;
    let options = {
      headers: new Headers({
        "Content-Type": "text/html",
        Authorization: "Bearer " + sessionStorage.getItem("accesstoken"),
      }),
    };
    this.http
    .get(this.BaseUrl+"bookings/"+this.tripId+"/receipt_template/?vat_number="+this.vatNumber+"&lang="+this.lang,options)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any) => {
      this.reciepttoggle = false;
      this.print(data._body)
    },(error)=>{
      this.reciepttoggle = false;
       this.receptActive = true
       this.showVatPopup = true
    });
  }

  print(data:any): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-invoice').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(data);
    popupWin.document.close();
  }

  voucherClickPdf() {
    if(!this.downloadShow){
      return;
    }
    this.vouchertoggle = true;
    this.service.getVoucherPdf(this.tripId,this.lang).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.showVoucherPdf(data)
    },(error)=>{
      this.vouchertoggle = false;
      Swal.fire({
        text: this.translate.instant('Some Technical Problem,Please Try Later'),
        icon: "warning",
        confirmButtonText: this.translate.instant("ok"),
      });
    });
  }

  showVoucherPdf(blob) {
    var newBlob = new Blob([blob], { type: "application/pdf" })
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    link.href = data;
    link.download = "Voucher.pdf";
    link.click();
    this.vouchertoggle = false;
  }

  checkCancellation() {
    if(!this.downloadShow){
      return;
    }
    if(this.checkTimeStamp()){ 
    this.cancellationtoggle = true;
    this.setTimerForCheckCanApiIsPendingForMorethan30Seconds()
    this.checkCanResponse = false;
    this.service.getCheckCancellation(this.tripId,this.lang).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.cancellationtoggle = false;
      this.checkCanResponse = true;
      this.checkCancelData.cancel = data;
      window.scrollTo(0, 0);
      if (data.can_cancel_booking) {
        this.cancelationPopup = true;
      } else {
        Swal.fire({
          text: this.translate.instant('Sorry, No Cancellation Available'),
          icon: "warning",
          confirmButtonText: this.translate.instant("ok"),
        });
      }
    },(error)=>{
      this.cancellationtoggle = false;
      this.checkCanResponse = true;
      Swal.fire({
        text: this.translate.instant('Some error occurred. Please try again later'),
        icon: "warning",
        confirmButtonText: this.translate.instant("Ok"),
      });
    });
    }else{
      Swal.fire({
        text: this.translate.instant('You can cancel a booking only after 5 minuts'),
        icon: "warning",
        confirmButtonText: this.translate.instant("Ok"),
      });
    }
  }

  setTimerForCheckCanApiIsPendingForMorethan30Seconds(){
    timer(this.pendingApiTimer).pipe(takeUntil(this.destroy$)).subscribe(x => {
        if(!this.checkCanResponse){
          if(this.canSubscription != undefined && this.canSubscription != null){
            this.canSubscription.unsubscribe();
          }
        Swal.fire({
          icon: 'error',
          text: this.translate.instant("It seems like server busy from Maqam-GDS.Try again later"),
          confirmButtonText: this.translate.instant('Try Again')
        }).then((result) => {
          this. checkCancellation()
        })
      }
    });
  }

  checkTimeStamp(){
    if(this.tripData && this.tripData.booking_timestamp != null){
      var current = Math.round(new Date().getTime()/1000) ;
      var stamp = Math.round(this.tripData.booking_timestamp);
      var timeDiff = 0;
      if(current > 0 && stamp > 0){
        timeDiff = current - stamp;
        if(timeDiff > 300){
          return true
        }else{
          return  false
        }
        }
      }      
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  }

  closeCancelPopup() {
    this.cancelationPopup = false;
  }

  hideVatpopup(){
    this.showVatPopup = false;
  }

sumitVatNumber(){
    if(this.vatNumber != "" && this.vatNumber.length >2){
      if(this.invoiceActive){
        this.invoiceActive = false
        this.showVatPopup = false;
      }
      if(this.receptActive){
        this.receptActive = false;
        this.showVatPopup = false;
      }
    }else{
      Swal.fire({
        text: this.translate.instant('Invalid VAT number'),
        icon: "warning",
        confirmButtonText: this.translate.instant("ok"),
      });
    }
  }

}
