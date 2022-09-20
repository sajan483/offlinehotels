import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BranchApiService } from 'src/app/Services/branch-api-service';

@Component({
  selector: 'app-passport-upload',
  templateUrl: './passport-upload.component.html',
  styleUrls: ['./passport-upload.component.scss']
})
export class PassportUploadComponent implements OnInit {
  id:any;
  referencrNo: any;
  paxCount:number;
  shimmer:boolean = true;
  bookingId: number;
  travellerArray: any;

  constructor(private activeRouter:ActivatedRoute,private apiService:BranchApiService) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.id = this.activeRouter.params.subscribe(data =>{
      this.id = data['id'];
      this.apiService.getBookingDetails(this.id).subscribe(data=>{
        this.shimmer = false;
        this.bookingId = data.id;
        this.travellerArray = data.travellers;
        this.referencrNo = data.reference_no;
        this.paxCount = data.adults + data.children_with_bed + data.children_without_bed;
      })
    })
  }

}
