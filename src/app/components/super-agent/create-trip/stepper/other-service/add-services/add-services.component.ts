import { Component, Input, OnInit } from '@angular/core';
import { HelperService } from 'src/app/common/services/helper-service';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';

@Component({
  selector: 'app-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.scss']
})
export class AddServicesComponent implements OnInit {

  @Input() serviceData : any;
  categoryUrl:any = 'https:\/\/app.umrahtrip.com\/storage\/app\/public\/category';
  restaurantUrl: any;
  navigateDiv:any = 'category';
  subCategoryValue: any;
  lowerCategoryValue:any;
  shimmer: boolean;
  offsetValue:number = 0;
  itemsValue: any[] = [];
  productUrl: any;
  currency: string;

  constructor(private SuperAgentService:SuperAgentApiService,private helper:HelperService) { }

  ngOnInit() {
    this.currency = sessionStorage.getItem('currency');
    this.SuperAgentService.appConfig().subscribe((data:any) =>{
      this.categoryUrl = data.base_urls.category_image_url;
      this.restaurantUrl = data.base_urls.restaurant_image_url;
      this.productUrl = data.base_urls.product_image_url;
    })
  }

  viewShope(id){
    this.navigateDiv = 'subCategory';
    this.shimmer = true;
    this.SuperAgentService.getCategoryChild(id).subscribe(data =>{
      this.shimmer = false;
      this.subCategoryValue = data;
    })
  }

  viewSubCategory(id){
    this.navigateDiv = 'lowerCategory';
    this.shimmer = true;
    this.SuperAgentService.getCategoryChild(id).subscribe(data =>{
      this.shimmer = false;
      this.lowerCategoryValue = data;
    })
  }
  
  viewItems(id){
    this.navigateDiv = 'Items';
    this.getItemValue(id,this.offsetValue)
  }

  getItemValue(id,offset){
    this.shimmer = true;
    this.SuperAgentService.getItemsValues(id,offset).subscribe((data:any)=>{
      this.shimmer = false;
      this.itemsValue = data.products;
    })
  }

  backAddons(data){
    this.navigateDiv = data;
  }

  currencyConversion(amount){
    return this.helper.priceConversion(amount);
  }

  discountAmount(amount,discAmount,type){
    if(type == 'percent'){
      var amt = amount - (amount*(discAmount/100))
      return this.currencyConversion(amt)
    }
    if(type == 'amount'){
      var amt = amount - discAmount;
      return this.currencyConversion(amt)
    }
  }

}
