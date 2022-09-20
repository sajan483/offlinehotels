import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BranchApiService } from 'src/app/Services/branch-api-service';

@Component({
  selector: 'app-package-bookings',
  templateUrl: './package-bookings.component.html',
  styleUrls: ['./package-bookings.component.scss']
})
export class PackageBookingsComponent implements OnInit {
  details: any;
  shimmer:boolean = false;
  view: any;
  totalPax: any;
  currentPage:number = 1;
  totalPage:number;
  totalPageDummy:number;
  selectedBooking: any;
  showDetailShimmer = true;
  showDetailsModal = false;
  readonly:any;
  detailsDummy: any;
  searchData: any = '';
  dateSelect: any = '';
  search: string = '';


  constructor(private apiService:BranchApiService,private route:Router,private toastService:ToastrService,private datepipe:DatePipe) { }

  ngOnInit() {
    this.getDatas(this.currentPage)
  }

  getDatas(page){
    this.shimmer = true;
    this.apiService.paginateBoogingsListSearch(page,this.search).subscribe(value =>{
      this.details = value.results;
      this.shimmer = false;
      this.totalPage = value.total_pages;
      this.currentPage = value.page;
    })
  }

  reSet(){
    this.searchData = '';
    this.dateSelect = '';
    this.currentPage = 1;
    this.search = '';
    this.getDatas(1);
  }

  searchFilter(){
    this.search = '';
    if(this.searchData != ''){
      if(this.searchData.split('-').length > 1){
        this.search = '&reference_code=' + this.searchData.split('-')[0] + '&master_package=' + this.searchData.split('-')[1];
      }else{
        this.search = '&reference_code=' + this.searchData;
      }
      if(this.dateSelect != ''){
        this.search = this.search + '&start_date=' + this.dateFormater(this.dateSelect)
      }
    }else if(this.dateSelect != ''){
      this.search = '&start_date=' + this.dateFormater(this.dateSelect)
    }else{
      return
    }
    this.getDatas(1);
  }

  dateFormater(date: any) {
    let latest_date = this.datepipe.transform(date, "yyyy-MM-dd");
    return latest_date;
  }

  paginateEnquiries(event) {
    if(event>=1 && event<=this.totalPage){
      this.currentPage = event;
      this.getDatas(this.currentPage);
    }
  }

  viewData(id){
    this.route.navigate(["/branch/packages/bookings/"+id+"/details"]);
  }

  navigateBack(){
    this.route.navigate(["/branch/packages"]);
  }

  checkColor(data){
    if(data != null && data.length > 0){
      data = data. toUpperCase();
      var hash = 0;
      for (var i = 0; i < data.length; i++) {
        hash = data.charCodeAt(i) + ((hash << 5) - hash);
      }
      var colour = '#';
      for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
      }
      return this.djust(colour,-30)
    }
  }

  djust(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  closeDetailsModal(){
    this.showDetailsModal = false;
  }

  getPackageUrl(booking){
    if(booking.package == null || booking.package == undefined || booking.package.master_package == null || booking.package.master_package == undefined){
      return "";
    }
    return 'https://www.akbarumrah.com/packages/'+(booking.package.master_package.id)+'/'+(booking.package.master_package.title)+'-from-'+(booking.package.master_package.from)+'-'+(booking.package.master_package.days)+'days'
  }


  getTitle(booking){
    return (booking.no_of_days)+' days ' +  (booking.package_name)+' from '+(booking.package_location);
  }
}
