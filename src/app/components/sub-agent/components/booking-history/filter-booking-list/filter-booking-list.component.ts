import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-booking-list',
  templateUrl: './filter-booking-list.component.html',
  styleUrls: ['./filter-booking-list.component.scss']
})
export class FilterBookingListComponent implements OnInit {

  bookingDate:any;
  statusData:any = "";
  toDay = new Date();
  searchData:any = '';
  @Output() setSearchBody = new EventEmitter();
  searchBrn:any='';
  searchUtNumber:any='';
  searchTag:any = '';
  searchCompany:any = '';
  searchService:any = '';

  constructor(public datepipe:DatePipe) { }

  ngOnInit() {
  }

  searchFilter(){
    this.searchData = '';
    if(this.searchBrn != '' && this.searchBrn != undefined){
     this.searchData = this.searchData+"&brn="+this.searchBrn;
    }
    if(this.searchUtNumber != '' && this.searchUtNumber != undefined){
      this.searchData = this.searchData+"&ut="+this.searchUtNumber;
     }
     if(this.searchTag != '' && this.searchTag != undefined){
      this.searchData = this.searchData+"&tag="+this.searchTag;
     }
     if(this.searchCompany != '' && this.searchCompany != undefined){
      this.searchData = this.searchData+"&company="+this.searchCompany;
     }
     if(this.searchService != '' && this.searchService != undefined){
      this.searchData = this.searchData+"&service="+this.searchService;
     }
   if(this.bookingDate != '' && this.bookingDate != undefined){
     let sdate = this.datepipe.transform(this.bookingDate[0],'dd-MM-yyyy')
     let edate = this.datepipe.transform(this.bookingDate[1],'dd-MM-yyyy')
     this.searchData = this.searchData+"&s_date="+sdate+"&e_date="+edate;
   }
   if(this.statusData != '' && this.statusData != undefined){
     this.searchData = this.searchData+"&status="+this.statusData;
   }
   if(this.searchData != ''){
    this.search();
   }
  }

  resetFilter(){
    if(this.searchData != ''){
     this.bookingDate = '';
     this.statusData = '';
     this.searchData = '';
     this.searchBrn='';
     this.searchUtNumber='';
     this.searchTag = '';
     this.searchCompany = '';
     this.searchService = '';
     this.search();
    }
  }

  search(){
    this.setSearchBody.emit(this.searchData);
  }

}
