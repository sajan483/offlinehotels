import { Component, OnInit } from '@angular/core';
import { GeneralHelper } from 'src/app/helpers/General/general-helpers';
import { SubAgentGeneralHelper } from 'src/app/helpers/sub-agent/general-helper';

@Component({
  selector: 'app-iban-creater',
  templateUrl: './iban-creater.component.html',
  styleUrls: ['./iban-creater.component.scss']
})
export class IbanCreaterComponent implements OnInit {

  value:any = 1000000000000000000001;
  max:any = 1000000000000000000010;
  ibanShow :any = 'SA1000000000000000000000';
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);
  constructor(private genHelper: GeneralHelper,) { }

  ngOnInit() {
    this.genHelper.checkForAccessToken();
  }

  nextiban(){

    for(let i =  100000;i < 900000;i++){
      var ibn = 'SA11000000000000000'+i;
      var check = this.subagentHelper.ibanTextValidation(ibn);
      console.log(i);
      if(check == 'true'){
        console.log(ibn);
        this.ibanShow = ibn;
        break;
      }
      
    }
  }

  toFixed(x) {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x += (new Array(e+1)).join('0');
      }
    }
    return x;
  }

}
