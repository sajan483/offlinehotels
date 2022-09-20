import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/common/services/notification.service';
import { BranchApiService } from 'src/app/Services/branch-api-service'
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';
@Component({
  selector: 'app-view-packages',
  templateUrl: './view-packages.component.html',
  styleUrls: ['./view-packages.component.scss']
})
export class ViewPackagesComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  shimmer:boolean = true;
  packages: any;
  totalPage:number = 0;
  page = 1;
  currentPage = 1;
  searchData:any;
  publishFilter:any[]=[];
  activeFilter:any[]=[
    {name:'Active',active:'True'},
    {name:'Deactive',active:'False'}
  ];
  activeFilterData:any;
  filterDiv: boolean = false;
  filterDatas: string = '';

  constructor(private branchApi:BranchApiService,private route:Router,private toastService:ToastrService,private superAgentService:SuperAgentApiService,
    private notifyService: NotificationService) { }

  ngOnInit() {
    this.initialFilter();
  }

  viewFilter(){
    this.filterDiv = !this.filterDiv;
  }

  initialFilter(){
    this.searchData = '';
    this.publishFilter = [
      {
        name: 'UNPUBLISHED',
        checked: false,
      },
      {
        name: 'All',
        checked: false,
      },
      {
        name: 'B2B',
        checked: false,
      },
      {
        name: 'B2C',
        checked: false,
      },
    ];
    this.activeFilterData = '';
    this.getPackages(1);
  }

  viewPackage(id){
    window.open('https://b2b.umrahtrip.com/superagent/package/'+id+'/view',"_blank")
  }

  getPackages(page) {
    this.shimmer = true;
    this.superAgentService.filterMasterPackage(this.filterDatas,page).pipe(takeUntil(this.destroy$)).subscribe((res:any) => {
        this.packages = res.results;
        this.totalPage = res.total_pages;
        this.shimmer = false;
    },(err)=>{
      this.notifyService.showError("Something went wrong in server. Please try again later or contact support team.")
      this.initialFilter();
    });
  }

  paginate(event) {
    if(event>=1 && event<=this.totalPage){
      this.currentPage = event;
      this.getPackages(this.currentPage);
    }
  }

  editPackage(id){
    this.route.navigateByUrl('superagent/package/'+id+'/edit');
  }

  manageBooking(id){
    this.route.navigateByUrl('superagent/package/'+id+'/manage-bookings');
  }

  visaRequests(id){
    this.route.navigateByUrl('superagent/package/'+id+'/visa-requests');
  }

  visaSubmission(id){
    this.route.navigateByUrl('superagent/package/'+id+'/visa-submissions');
  }

  duplicatePackage(id){
    this.superAgentService.duplicatePackage(id).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.status.toLowerCase() == 'success') {
        this.toastService.success("Package Duplicated Successfully");
        this.getPackages(this.currentPage);
      }else{
        this.toastService.error("Something went wrong");
      }
    });
  }

  enablePackage(id){
    this.superAgentService.enableDisablePackage(id).pipe(takeUntil(this.destroy$)).subscribe(res =>{
      this.toastService.success("Successfully");
      this.getPackages(1);
    })
  }

  publishSelect(val){
    this.publishFilter.forEach(data =>{
      if(data.name == val){
        data.checked = !data.checked;
      }
    })
  }

  searchFilter(){
    var search = '';
    var publish:boolean = false;
    var publishData = '';

    this.publishFilter.forEach(data =>{
      if(data.checked){
        publish = true;
        publishData = publishData + data.name +','
      }
    })

    if(this.searchData != ''){
      search = search + '&search='+this.searchData;
    }
    if(publish){
      search = search + '&published_to='+publishData;
    }
    if(this.activeFilterData != ''){
      search = search + '&active='+this.activeFilterData;
    }

    this.filterDatas = search;

    this.getPackages(1)
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }
}