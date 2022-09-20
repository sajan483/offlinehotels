import { Component, Input, OnInit } from '@angular/core';
import { ApiServiceSubAgent } from '../../../services/api-service-sub-agent';

@Component({
  selector: 'app-sales-overview',
  templateUrl: './sales-overview.component.html',
  styleUrls: ['./sales-overview.component.scss']
})
export class SalesOverviewComponent implements OnInit {

  colorScheme = { domain: ['#116063', '#c59b6d'], };
  saleChartData = [];
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  view: any[] = [200, 150];

  monthBttn = [
    {mnth:1,text:"1 month"},
    {mnth:3,text:"3 months"},
    {mnth:6,text:"6 months"},
    {mnth:12,text:"1 Year"}
  ];
  
  monthCount:number = 1;
  salesReport:any;

  @Input() currency:any;

  constructor(private subAgentApiService: ApiServiceSubAgent) { }

  ngOnInit() {
    this.selectMonth(1);
  }

  selectMonth(mnth){
    this.monthCount = mnth;
    this.subAgentApiService.getCurrentSalesReport({month:mnth}).subscribe((res)=>{
      this.salesReport = res.data;
      this.saleChartData = [
        {
          "value":this.salesReport.hotel.sales_amount,
          "name":"Hotel"
        },{
          "value":this.salesReport.transport.sales_amount,
          "name":"Transport"
        }
      ];
    })
  }

}
