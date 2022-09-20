import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-super-agent-header',
  templateUrl: './super-agent-header.component.html',
  styleUrls: ['./super-agent-header.component.scss']
})
export class SuperAgentHeaderComponent implements OnInit {

  userType:string = '';

  constructor(public router: Router) { }

  ngOnInit() {
  }

  navigatepage(link: any) {
    this.router.navigate([link]);
  }

  navigateagencyprofile() {
    this.router.navigate(["/superagent/profile/", sessionStorage.getItem("agency_Id")]);
  }

  logout() {
    let lang = sessionStorage.getItem('userLanguage');
    let country = JSON.parse(sessionStorage.getItem('country_code'))
    sessionStorage.clear();
    sessionStorage.setItem('userLanguage',lang)
    sessionStorage.setItem('country_code',JSON.stringify(country));
    this.router.navigate(["/login"]);
  }

}
