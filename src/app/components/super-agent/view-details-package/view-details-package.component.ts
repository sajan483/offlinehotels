import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { takeUntil } from "rxjs/operators";
@Component({
  selector: 'app-view-details-package',
  templateUrl: './view-details-package.component.html',
  styleUrls: ['./view-details-package.component.scss']
})
export class ViewDetailsPackageComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  id:any;
  packageDetails: any;
  itenerary: any;
  availabilityCount: number;
  availability: number;
  maxCount: any;
  shimmer:boolean=true;
  details: any;
  view: any;

  constructor(private activeRouter:ActivatedRoute,private route:Router,private branchService: SuperAgentApiService) { }

  ngOnInit() {
    this.getPackageDetails()
    this.getBookigDetails()
  }

  getBookigDetails(){
    this.id = this.activeRouter.params.pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.id = data['id'];
      this.branchService.getPackageBookingDetails(this.id).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
        this.details = data.data;
      })
    })
  }

  getPackageDetails(){
    this.id = this.activeRouter.params.pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.id = data['id'];
      this.branchService.getPackageDetails(this.id).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
        this.shimmer = false;
        this.packageDetails = data;
        this.itenerary = data.itinerary_set;
        this.availabilityCount = data.max_passengers - data.booked_count;
        this.availability = this.availabilityCount;
        this.maxCount = data.max_passengers;
      })
    });
  }

  expandItenary(event){
    var panel = event.target.previousElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

  back(){
    this.route.navigate(["/superagent/view_package"])
  }

  viewData(data){
    this.view = data;
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  }

}