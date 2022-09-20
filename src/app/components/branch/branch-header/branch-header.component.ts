import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchApiService } from 'src/app/Services/branch-api-service';

@Component({
  selector: 'app-branch-header',
  templateUrl: './branch-header.component.html',
  styleUrls: ['./branch-header.component.scss']
})
export class BranchHeaderComponent implements OnInit {

  userName:string = '';

  constructor(public router: Router,private branchApi:BranchApiService) { }

  ngOnInit() {
    this.getProfile()
  }

  getProfile(){
    this.branchApi.getProfile().subscribe(data =>{
      this.userName = data.name;
    })
  }

  navigatepage(link: any) {
    this.router.navigate([link]);
  }

  logout() {
    this.router.navigate(["/login"]);
  }

}
