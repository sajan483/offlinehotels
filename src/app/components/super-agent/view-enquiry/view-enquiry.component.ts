import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-view-enquiry',
  templateUrl: './view-enquiry.component.html',
  styleUrls: ['./view-enquiry.component.scss']
})
export class ViewEnquiryComponent implements OnInit,OnDestroy {
  enquiryList: any = []
  private destroy$ = new Subject();
  shimmer = true;
  totalPage = 1;
  currentPage = 1;
  searchData:any = '';
  statusData:any = '';
  dateRange:any[] = [];
  today = new Date();

  constructor(private superAgentService:SuperAgentApiService, private toastService:ToastrService,public datepipe:DatePipe){
  }

  ngOnInit() {
    this.currentPage = 1;
    this.getEnquiries(null);
  }

  getEnquiries(page) {
    this.shimmer = true;
    this.superAgentService.getEnquiries(page).pipe(takeUntil(this.destroy$)).subscribe((res:any)=> {
      if (res.status.toLowerCase() == 'success') {
        this.enquiryList = res.data.results;
        this.totalPage = res.data.total_pages;
      }else{
        this.enquiryList = [];
        this.totalPage = 0;
      }
      this.shimmer = false;
    });
  }

  reSet(){
    this.searchData = '';
    this.statusData = '';
    this.dateRange = [];
    this.getEnquiries(1)
  }

  paginateEnquiries(event) {
    if(event>=1 && event<=this.totalPage){
      this.currentPage = event;
      this.getEnquiries(this.currentPage);
    }
  }

  onChangeStatus(id, status){
    this.superAgentService.changeEnquiryStatus(id,status).pipe(takeUntil(this.destroy$)).subscribe((res:any) => {
      if (res.status.toLowerCase() == 'success') {
        this.toastService.success("Enquiry status changed successfully");
        this.getEnquiries(this.currentPage);
      }else{
        this.toastService.error("Something went wrong");
      }
    }, err => {
      this.toastService.error("Something went wrong");
    });
  }


  getPackageUrl(enquiry){
    window.open('https://www.umrahtrip.com/packages/'+(enquiry.master_package_id)+'/'+(enquiry.master_package_title.replaceAll(' ','-'))+'-from-'+(enquiry.from_location)+'-'+(enquiry.no_of_days)+'days',"_blank")
  }
  getTitle(enquiry){
    return (enquiry.package.master_package.days)+' days ' +  (enquiry.package.master_package.title)+' from '+(enquiry.package.master_package.from);
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
      return this.djust(colour,-30);
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
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    
    return this.djust(('#' + this.padZero(r) + this.padZero(g) + this.padZero(b)),-30);
    }
  }

  padZero(str) {
    var len = str.length || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }

  selectColor(data){
    if(data == 'new'){
      return '#2196f3'
    }else if(data == 'contacted'){
      return '#ff9800'
    }else if(data == 'pending'){
      return '#f44336'
    }else if(data == 'converted'){
      return '#4caf50'
    }else if(data == 'lost'){
      return '#9e9e9e'
    }
    
  }

  statusFetch(data){
    this.statusData = data;
    this.searchFilter();
  }

  dateFormater(date: any) {
    let latest_date = this.datepipe.transform(date, "dd-MM-yyyy");
    return latest_date;
  }

  searchFilter(){
    var search = '';
    if(this.searchData != ''){
      search = '?search='+this.searchData;
      if(this.statusData != ''){
        search = search + '&status='+this.statusData;
      }
      if(this.dateRange.length > 0){
        var start = this.dateFormater(this.dateRange[0]);
        var end = this.dateFormater(this.dateRange[1]);
        search = search + '&start=' + start + '&end=' + end;
      }
    }else if(this.statusData != ''){
      search = '?status='+this.statusData;
      if(this.dateRange.length > 0){
        var start = this.dateFormater(this.dateRange[0]);
        var end = this.dateFormater(this.dateRange[1]);
        search = search + '&start=' + start + '&end=' + end;
      }
    }else if(this.dateRange.length > 0){
      var start = this.dateFormater(this.dateRange[0]);
      var end = this.dateFormater(this.dateRange[1]);
      search ='?start=' + start + '&end=' + end;
    }else{
      return;
    }
    this.shimmer = true;
    this.superAgentService.filterEnquiries(search).pipe(takeUntil(this.destroy$)).subscribe((res:any) =>{
      if (res.status.toLowerCase() == 'success') {
        this.enquiryList = res.data.results;
        this.totalPage = res.data.total_pages;
      }else{
        this.enquiryList = [];
        this.totalPage = 0;
      }
      this.shimmer = false;
    })
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  }
  
}