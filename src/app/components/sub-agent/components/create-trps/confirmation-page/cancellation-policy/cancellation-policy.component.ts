import { Component, Input, OnInit } from '@angular/core';
import { SubAgentCancellationBar } from 'src/app/components/sub-agent/helpers/cancellation-bar';

@Component({
  selector: 'app-cancellation-policy',
  templateUrl: './cancellation-policy.component.html',
  styleUrls: ['./cancellation-policy.component.scss']
})
export class CancellationPolicyComponent implements OnInit {

  @Input() tripData:any[]=[];
  @Input() totalAmound:any = 0;
  @Input() currency:any;
  selectedIndex:number = 0;
  @Input() isHotelSeclection:boolean;
  private cancellationHelper:SubAgentCancellationBar = new SubAgentCancellationBar();
  barData:any = [];
  hotelPolicyData:any[]=[];
  @Input() isMobile:boolean = false;

  constructor() { }

  ngOnInit() {
    this.setBarData();
  }

  setBarData(){
    if(this.isHotelSeclection){
      this.hotelPolicyData = [];
      this.tripData.forEach((item:any)=>{
        let barData = this.cancellationHelper.setCancellationBarData(item.cancellation_policy.rules);
        this.hotelPolicyData.push({
          barData:barData,
          room_name:item.name,
          room_count:item.quantity,
          is_refundable:item.cancellation_policy.is_refundable
        });
      })
      
    }else{
      this.barData = this.cancellationHelper.setCancellationBarData(this.tripData[0].rules);
    }
  }

  selected(i:number){
    this.selectedIndex = i;
  }


}
