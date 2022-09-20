import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/common/services/notification.service';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {
  @Input() recentHistory: any;
  @Input() currency:any;
  @Input() shimmer:any;
  @Input() language:any;
  ratingMakkah = 1;
  readonly = true;
  openId: number;
  isMobile:boolean = false;

   @HostListener('document:mousedown', ['$event'])
   onGlobalClick(event): void {

      let el1 = this.elRef.nativeElement.querySelectorAll('.brnnumbView');

      if (!this.elRef.nativeElement.contains(event.target)) {
        for (let i = 0; i < el1.length; i++) {
          if ('visible' == (el1[i] as HTMLElement).style.visibility) {
            if((el1[i] as HTMLElement).id=='cp_'+this.openId){
              (el1[i] as HTMLElement).style.visibility = 'hidden';
            }
          }
        }
      }else{
      }
    }
  constructor(private router: Router, private appStore: AppStore, private notifyService: NotificationService,
    private translate: TranslateService, private elRef: ElementRef,) { }

  ngOnInit() {
    if (window.innerWidth < 992) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }


  /**
   * this method for navigate details page
   */
  viewhistory(id: any) {
    if(this.isMobile){
      this.router.navigate(["subagent/bookings/"+ id + "/itinerary/"+this.language+"/"+this.currency]);
    }else{
      const url = this.router.serializeUrl(
        this.router.createUrlTree(
          ["subagent/bookings/"+ id + "/itinerary/"+this.language+"/"+this.currency],
        )
      );
      window.open(url, '_blank');
    }
  }

  /**
   * this merthod is used to copy data
   * @param val
   */
  copytext(val: string) {
    if (val != '') {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.notifyService.showSuccess(this.translate.instant("Copied Booking Reference Number"));
    }
    this.toggleCopyBanner(null,true);
  }


  toggleCopyBanner(k, allowed) {
    if (allowed) {
      let el1 = this.elRef.nativeElement.querySelectorAll('.brnnumbView');
      for (let i = 0; i < el1.length; i++) {
        (el1[i] as HTMLElement).style.visibility = 'hidden';
      }
      if (k != null) {
        if (this.openId == null || k != this.openId) {
          let el = (this.elRef.nativeElement.querySelectorAll('#cp_' + k) as HTMLElement);
          el[0].style.visibility = 'visible';
          this.openId = k;

        } else {
          this.openId = null;
        }
      }
    }else{
      this.notifyService.showWarning("No BRN found");
    }
  }

}
