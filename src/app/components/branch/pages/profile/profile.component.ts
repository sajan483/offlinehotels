import { Component, OnInit } from '@angular/core';
import { BranchApiService } from 'src/app/Services/branch-api-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  details: any;

  constructor(private branchApi:BranchApiService) { }

  ngOnInit() {
    this.branchApi.getProfile().subscribe(data =>{
      this.details = data;
    })
  }

}
