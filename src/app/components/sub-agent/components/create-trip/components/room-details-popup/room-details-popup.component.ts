import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HedderComponent } from 'src/app/common/components/hedder/hedder.component';
import { SubAgentGeneralHelper } from 'src/app/helpers/sub-agent/general-helper';
import { HotelDetailsPopupComponent } from '../hotel-details-popup/hotel-details-popup.component';

@Component({
  selector: 'app-room-details-popup',
  templateUrl: './room-details-popup.component.html',
  styleUrls: ['./room-details-popup.component.scss']
})
export class RoomDetailsPopupComponent implements OnInit {
  selectedRoomDetails: boolean;
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);
  currency: any;

  constructor(private translate: TranslateService) { }
  @Input() setViewData:any;

  ngOnInit() {
    console.log(this.setViewData);
  }

  ngAfterViewChecked() {
    this.translate.use((sessionStorage.getItem('userLanguage') === 'ar-AE') ? "ar-AE" : sessionStorage.getItem('userLanguage'));
    if (sessionStorage.getItem('userLanguage') == "ar-AE" || sessionStorage.getItem('userLanguage') == "ur-UR") {
      (<HTMLInputElement>document.getElementById("body")).classList.add('mirror_css');
    } else {
      (<HTMLInputElement>document.getElementById("body")).classList.remove('mirror_css');
    }
  }
  /*
 * this method for hide room details popup
 */
  hideRoomDetailsPopUp(){
    HotelDetailsPopupComponent.roomMoreDetails = false;
  }

  currencyConversion(amount){
    return this.subagentHelper.currencyCalculation(amount)
  }

  ngDoCheck(){
    this.currency = HedderComponent.globelCurrency;
  }

}
