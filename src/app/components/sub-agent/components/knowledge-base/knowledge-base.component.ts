import { Component, OnInit } from '@angular/core';
import { SegmentService } from 'ngx-segment-analytics';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss']
})
export class KnowledgeBaseComponent implements OnInit {
  prodUrl: string = "";
  baseUrl: string = environment.prodUrl;

  constructor(private segment:SegmentService) { }

  ngOnInit() {
    this.findProdUrlConfig()
    this.setUserDataForSegmentAnalysis()
  }
  setUserDataForSegmentAnalysis(){
    if(this.baseUrl  == this.prodUrl){
       window.analytics.page('subagent/knoledge base',{
        user:localStorage.getItem("userTypeName"),
        userId:localStorage.getItem("userId"),
        portal:"B2B"
      });
    }
  }

findProdUrlConfig(){
    const parsedUrl = new URL(window.location.href);
       this.baseUrl = parsedUrl.origin;
}

}
