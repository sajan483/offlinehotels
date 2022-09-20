import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,OnDestroy {
  months = [];
  selectedItem = [];
  dropdownSettings: any = {};
  dashboardData: any;
  shimmer:boolean = true;
  private destroy$ = new Subject();
  bookingList: any = []
  totalPage = 1;
  showDetailsModal = false;
  currentPage = 1;
  showDetailShimmer = true;
  selectedBooking: any;
  readonly = true;
  searchData:any='';
  dateRange:any[]=[];
  today = new Date();

  constructor(public router: Router,public superAgentApiService:SuperAgentApiService, private toastService:ToastrService,private route:Router,
    private datepipe:DatePipe) { }

  ngOnInit() {
    this.multiSelction();
    
    this.fetchSalesOverView('')
     this.currentPage = 1;
    this.getBookings(null);
  }

  fetchSalesOverView(month){
    this.superAgentApiService.getSalesOverView(month).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.shimmer = false;
      this.dashboardData = data;
      this.months = this.dashboardData.available_months
      this.chartSale();
    });
  }
  
  multiSelction(){
    this.selectedItem = ['Apr 2021'];
    this.dropdownSettings = {
        singleSelection: true,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        allowSearchFilter: false,
        closeDropDownOnSelection: true
    };
  }

  onItemSelect(mnth) {this.fetchSalesOverView(mnth[0])}

  chartSale(){
      var myChart = new Chart("myChart", {
          type: 'doughnut',
          data: {
              labels: ['Active Packages','Sales'],
              datasets: [{
                  label: '# of Votes',
                  data: [this.dashboardData.sales_overview.activate_package_percentage, this.dashboardData.sales_overview.sales_percentage],
                  backgroundColor: [
                      '#e2a8a6',
                      '#8ac95a'
                  ],
                  borderWidth: 1
              }]
          },
          
      });
  }

  navigate(link: any) {this.router.navigate([link]);}
  
  navigateagencyprofile() {
    this.router.navigate(["/superagent/profile/", sessionStorage.getItem("agency_Id")]);
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }

  getBookings(page) {
    this.shimmer = true;
    this.superAgentApiService.getBookings(page).pipe(takeUntil(this.destroy$)).subscribe((res:any) => {
      if (res.status.toLowerCase() == 'success') {
        this.bookingList = res.data.results;
        this.totalPage = res.data.total_pages;
      }else{
        this.bookingList = [];
        this.totalPage = 0;
      }
      this.shimmer = false;
    }, (error) => {
      this.shimmer = false;
      this.toastService.error("Something went wrong");
    });
  }

  paginateBookings(event) {
    if(event>=1 && event<=this.totalPage){
      this.currentPage = event;
      this.getBookings(this.currentPage);
    }
  }

  showBooking(id){
    this.route.navigateByUrl('superagent/package/'+id+'/bookings-details')
  }

  showBookingDetails(id){
    this.selectedBooking = null;
    this.showDetailsModal = true;
    this.showDetailShimmer = true;
    this.superAgentApiService.getBookingDetails(id).pipe(takeUntil(this.destroy$)).subscribe((res:any )=> {
      if (res.status.toLowerCase() == 'success') {
        this.showDetailShimmer = false;
        this.selectedBooking = res.data;

      }else{
        this.toastService.error("Something went wrong");
      }
    });
  }

  closeDetailsModal(){
    this.showDetailsModal = false;
  }

  getPackageUrl(booking){
    if(booking.package == null || booking.package == undefined || booking.package.master_package == null || booking.package.master_package == undefined){
      return "";
    }
    return 'https://www.umrahtrip.com/packages/'+(booking.package.master_package.id)+'/'+(booking.package.master_package.title)+'-from-'+(booking.package.master_package.from)+'-'+(booking.package.master_package.days)+'days'
  }


  getTitle(booking){
    return (booking.no_of_days)+' days ' +  (booking.package_name)+' from '+(booking.package_location);
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

  invertColor(color) {
    if(color != null && color.length > 0){
      var hex = color
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    console.log('#' + this.padZero(r) + this.padZero(g) + this.padZero(b) + "|" + color);
    
    return this.djust('#' + this.padZero(r) + this.padZero(g) + this.padZero(b),-20);
    }
  }

  padZero(str) {
    var len = str.length || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }

  dateFormater(date: any) {
    let latest_date = this.datepipe.transform(date, "dd-MM-yyyy");
    return latest_date;
  }

  reSet(){
    this.searchData = '';
    this.dateRange = [];
    this.getBookings(1)
  }

  searchFilter(){
    var search = '';
    if(this.searchData != ''){
      search = '?search=' + this.searchData;
      if(this.dateRange.length > 0){
        var start = this.dateFormater(this.dateRange[0]);
        var end = this.dateFormater(this.dateRange[1]);
        search = search + '&start=' + start + '&end=' + end;
      }
    }else if(this.dateRange.length > 0){
      var start = this.dateFormater(this.dateRange[0]);
      var end = this.dateFormater(this.dateRange[1]);
      search = '?start=' + start + '&end=' + end;
    }else{
      return;
    }
    this.shimmer = true;
    this.superAgentApiService.searchBookings(search).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      if (res.status.toLowerCase() == 'success') {
        this.bookingList = res.data.results;
        this.totalPage = res.data.total_pages;
      }else{
        this.bookingList = [];
        this.totalPage = 0;
      }
      this.shimmer = false;
    }, (error) => {
      this.shimmer = false;
      this.toastService.error("Something went wrong");
    })
  }
}
