import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-loader-hotel-popup',
  templateUrl: './loader-hotel-popup.component.html',
  styleUrls: ['./loader-hotel-popup.component.scss']
})
export class LoaderHotelPopupComponent implements OnInit {
  freeArray = ["1", "2", "3", "4"];
  constructor(private translate: TranslateService,) { }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.translate.use((sessionStorage.getItem('userLanguage') === 'ar-AE') ? "ar-AE" : sessionStorage.getItem('userLanguage'));
    if (sessionStorage.getItem('userLanguage') == "ar-AE" || sessionStorage.getItem('userLanguage') =="ur-UR") {
      (<HTMLInputElement>document.getElementById("body")).classList.add('mirror_css');
    } else {
      (<HTMLInputElement>document.getElementById("body")).classList.remove('mirror_css');
    }
  }

}