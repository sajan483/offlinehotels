import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubAgentApiService } from 'src/app/Services/sub-agent-api-services';
import { takeUntil } from "rxjs/operators";
import { Subject, Subscription,timer} from "rxjs";

@Component({
  selector: 'app-subpcc',
  templateUrl: './subpcc.component.html',
  styleUrls: ['./subpcc.component.scss']
})
export class SubpccComponent implements OnInit {
  @Input() hotelCode:any;
  @Input() ulogId:any;
  private destroy$ = new Subject();
  promoCodeList:any[]=[];
  @Input() promoCode:any;
  @Input() specialCode:any;
  @Output() searchSubPcc = new EventEmitter();

  constructor(private service:SubAgentApiService) { }

  ngOnInit() {
    this.listPromoCode()
  }

  listPromoCode(){
    this.promoCodeList = [];
    this.service.getSubPcc(this.ulogId).pipe(takeUntil(this.destroy$)).subscribe(data =>{
      data.forEach(element => {
        if (element.hotel_code == this.hotelCode) {
          if (element.sub_pcc.length > 0) {
            this.promoCodeList.push(element.sub_pcc)
          }
        }
      });
    })
  }

  setPromoCode(data){
    this.promoCode = data;
  }

  apply(){
    // if(this.promoCode. split(""). length > 0 || this.specialCode. split(""). length){
      
    // }
    let value = {
      promoCode : this.promoCode,
      specialCode: this.specialCode
    }
    this.searchSubPcc.emit(value);
  }

}
