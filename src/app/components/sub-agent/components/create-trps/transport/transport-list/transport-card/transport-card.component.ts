import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubAgentCancellationBar } from 'src/app/components/sub-agent/helpers/cancellation-bar';

@Component({
  selector: 'app-transport-card',
  templateUrl: './transport-card.component.html',
  styleUrls: ['./transport-card.component.scss']
})
export class TransportCardComponent implements OnInit {

  @Input() vehicle:any;
  @Input() vehicleCount:number;
  @Input() travelCount:number;
  @Input() currency:any;
  @Output() additionalServiceAdd = new EventEmitter();
  @Input() index:number;
  @Output() addFavorite = new EventEmitter();
  @Output() policyShow = new EventEmitter();
  @Output() saveService = new EventEmitter();
  private cancellationHelper:SubAgentCancellationBar = new SubAgentCancellationBar();
  barData:any = [];

  constructor() { }

  ngOnInit() {
    // if(this.vehicle.cancellation_policy.is_refundable){
    //   this.barData = this.cancellationHelper.setCancellationBarData(this.vehicle.cancellation_policy.rules);
    // }
  }

  checkAdditionalService(ev:any, data: any){
    let value = {
      checked:ev.checked,
      index:this.index,
      key:data.company_code + '-' +  data.vehicle_type_code + '-' + data.categories[0].category_code,
      data:data
    }

    this.additionalServiceAdd.emit(value);
  }

  clickFavIcon(data:any){
    let emitData = {
      company_code : data.company_code,
      vehicle_code : data.vehicle_type_code,
      category_code: data.categories[0].category_code
    }

    this.addFavorite.emit(emitData);
  }

  showPolicy(){
    let emitData = {
      cancellation_policy: this.vehicle.cancellation_policy,
      policies: this.vehicle.policies
    }

    this.policyShow.emit(emitData);
  }

  selectVechicle(data:any){
    this.saveService.emit(data);
  }

}
