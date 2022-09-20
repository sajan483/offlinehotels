import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { TransportFilterData, TransportFilterPostData } from 'src/app/components/sub-agent/models/transportListModel';

@Component({
  selector: 'app-transport-filter',
  templateUrl: './transport-filter.component.html',
  styleUrls: ['./transport-filter.component.scss'],
  animations: [
    trigger('expand', [
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('0.5s', style({ height: 0, opacity: 0 }))
      ]),
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.5s', style({ height: '*', opacity: 1 }))
      ])
    ]),
  ],
})
export class TransportFilterComponent implements OnInit {

  public DisabledAnimation: boolean = true;
  public showFiltertransportName: boolean = true;
  public showFilterCategory: boolean = true;
  public showFiltervehicleType: boolean = true;
  public showFiltervehicleModel: boolean = true;
  public showFilterAdditionalService: boolean = true;

  toggleFilterSections(section: string) {
    try {
      this.DisabledAnimation = false;
      if (section == 'transportName')
        this.showFiltertransportName = !this.showFiltertransportName;
      if (section == 'category')
        this.showFilterCategory = !this.showFilterCategory;
      if (section == 'vehicleType')
        this.showFiltervehicleType = !this.showFiltervehicleType;
      if (section == 'vehicleModel')
        this.showFiltervehicleModel = !this.showFiltervehicleModel;
      if (section == 'additionalService')
        this.showFilterAdditionalService = !this.showFilterAdditionalService;
    }
    catch (exception) {
      
    }
  }

  @Input() shimmer:boolean;
  @Input() filterData:TransportFilterData;
  @Input() companyName:any;
  @Output() transportCompanyName = new EventEmitter();
  @Input() filterPostData:TransportFilterPostData;
  @Output() resetFilter = new EventEmitter();
  @Output() postDataForFilter = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  companyFilter(evt){
    this.transportCompanyName.emit(this.companyName)
  }

  filterCategory(evt,i){
    if(evt.checked){
      this.filterData.category[i].checked = true;
    }else{
      this.filterData.category[i].checked = false;
    }
    let filter = [];
    this.filterData.category.forEach(data=>{
      if(data.checked){
        filter.push(data.code)
      }
    })
    this.filterPostData.category_id = filter;
    this.emitData()
  }

  filterVehicleType(evt,i){
    if(evt.checked){
      this.filterData.vehicle_type[i].checked = true;
    }else{
      this.filterData.vehicle_type[i].checked = false;
    }
    let filter = [];
    this.filterData.vehicle_type.forEach(data=>{
      if(data.checked){
        filter.push(data.item_id)
      }
    });
    this.filterPostData.vehicle_type_id = filter;
    this.emitData()
  }

  filterVehicleModel(evt,i){
    if(evt.checked){
      this.filterData.vehicle_model[i].checked = true;
    }else{
      this.filterData.vehicle_model[i].checked = false;
    }
    let filter = [];
    this.filterData.vehicle_model.forEach(data=>{
      if(data.checked){
        filter.push(data.model)
      }
    });
    this.filterPostData.vehicle_model = filter;
    this.emitData()
  }

  filterAdditionalService(evt,i){
    if(evt.checked){
      this.filterData.additional_service[i].checked = true;
    }else{
      this.filterData.additional_service[i].checked = false;
    }
    let filter = [];
    this.filterData.additional_service.forEach(data=>{
      if(data.checked){
        filter.push(data.additional_service_code)
      }
    });
    this.filterPostData.additional_service_id = filter;
    this.emitData()
  }

  emitData(){
    this.postDataForFilter.emit(this.filterPostData)
  }

  resetFilterAll(){
    this.resetFilter.emit();
  }

}
