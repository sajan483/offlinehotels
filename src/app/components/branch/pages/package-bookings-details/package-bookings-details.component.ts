import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/common/services/notification.service';
import { BranchApiService } from 'src/app/Services/branch-api-service';
import { branchHelper } from '../../helpers/branch-helpers';

@Component({
  selector: 'app-package-bookings-details',
  templateUrl: './package-bookings-details.component.html',
  styleUrls: ['./package-bookings-details.component.scss']
})
export class PackageBookingsDetailsComponent implements OnInit {
  id:any;
  selectedBooking: any;
  readonly = true;
  submitted = false;
  passportBody:any;
  shimmer:boolean = false;
  passportImg: any;
  helpert:branchHelper = new branchHelper();
  exceedDate:boolean = false;

  constructor(private fb:FormBuilder,private route:Router,private aciveRouter:ActivatedRoute,private apiService:BranchApiService,
    private notification:NotificationService) { }

  ngOnInit() {
    this.getDetails();
  }

  applayVisa(id){
    this.route.navigate(["/branch/bookings/"+id+"/visa-request"]);
  }

  getDetails(){
    this.shimmer = true;
    this.id = this.aciveRouter.params.subscribe(data =>{
      this.id = data['id'];
      this.apiService.getBookingDetails(this.id).subscribe(res =>{
        this.shimmer = false;
        this.selectedBooking = res;
        this.checkDate(this.selectedBooking.package.start_date)
        var totalBooking:number = this.selectedBooking.adults + this.selectedBooking.children_with_bed + this.selectedBooking.children_without_bed;
        this.passportBody = {
          id:this.selectedBooking.id,
          travllers: totalBooking
        }
      })
    })
  }

  checkDate(date){
    let today = this.helpert.incrementDate(new Date(),1);
    let day = today.getTime()/1000;
    let stamp = new Date(date).getTime()/1000;
    if(day < stamp){
      this.exceedDate = false;
    }else{
      this.exceedDate = true;
    }
    
  }

  setImage(img){
    console.log(img);
    
    this.passportImg = img;
  }

}
