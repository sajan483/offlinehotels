import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/common/services/notification.service';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';
@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  id:any;
  selectedBooking: any;
  readonly = true;
  mailForm:FormGroup;
  submitted = false;
  passportBody:any;
  shimmer:boolean = false;
  travellers=[];

  constructor(private fb:FormBuilder,private route:Router,private aciveRouter:ActivatedRoute,private apiService:SuperAgentApiService,
    private notification:NotificationService) { }

  ngOnInit() {
    this.getDetails();
    this.mailForm = this.fb.group({
      mailId:['',[Validators.required, Validators.email]]
    })
  }
  
  getDetails(){
    this.shimmer = true;
    this.id = this.aciveRouter.params.pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
      this.id = data['id'];
      this.apiService.getBookingDetails(this.id).pipe(takeUntil(this.destroy$)).subscribe((res:any) =>{
        this.shimmer = false;
        this.selectedBooking = res.data;
        this.mailForm.patchValue({
          mailId:this.selectedBooking.agency_details.email
        });
        var totalBooking:number = this.selectedBooking.adults + this.selectedBooking.children_with_bed + this.selectedBooking.children_without_bed;
        this.passportBody = {
          id:this.selectedBooking.id,
          travllers: totalBooking
        }
      })
    })
  }

  get f() { return this.mailForm.controls; }

  mailSubmit(){
    this.submitted = true;

    if (this.mailForm.invalid) {
        return;
    }

    this.apiService.resentMail(this.selectedBooking.id,this.mailForm.controls.mailId.value).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      (<HTMLElement>document.getElementById("closePopUp")).click();
      this.notification.showSuccess("send email")
    },(err)=>{
      this.notification.showError('Something went wrong in server. Please try again later or contact support team.')
    })
  }
  onTravellers(data:any){
    this.travellers = data;
  }
  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }
}