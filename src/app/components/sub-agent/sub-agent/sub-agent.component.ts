import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IsLoginHelpers } from '../helpers/isLogin-helper';

@Component({
  selector: 'app-sub-agent',
  templateUrl: './sub-agent.component.html',
  styleUrls: ['./sub-agent.component.scss']
})
export class SubAgentComponent implements OnInit {

  private isLoginHelper : IsLoginHelpers = new IsLoginHelpers(this.router);

  constructor(private router:Router) { }

  ngOnInit() {
    this.isLoginHelper.checkIsLogin();
  }

}
