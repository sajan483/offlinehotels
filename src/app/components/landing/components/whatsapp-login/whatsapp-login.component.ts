import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-whatsapp-login',
  templateUrl: './whatsapp-login.component.html',
  styleUrls: ['./whatsapp-login.component.scss']
})
export class WhatsappLoginComponent implements OnInit {

  constructor(private router:Router,private activeRoute:ActivatedRoute) { }

  ngOnInit() {
    this.checkQueryParam();
  }

  checkQueryParam(){
    this.activeRoute.queryParams.subscribe(params =>{
      if(params.token !== undefined){
        sessionStorage.setItem('accesstoken', params.token);
        localStorage.setItem('accesstoken', params.token);
        localStorage.setItem('agencyType', 'BRANCH');
        this.router.navigate(['branch/packages']);
      }else{
        this.router.navigate(["login"])
      }
    })
  }

}
