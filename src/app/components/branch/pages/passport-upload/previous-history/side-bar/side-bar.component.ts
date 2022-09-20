import {
  Component,
  AfterViewChecked,
  Renderer2,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnDestroy, AfterViewChecked {
  @Input() slidertype: string | undefined; //meals,baggage,seat,sports,prioritycheckin
  @Input() closeSliderPanel: Function | undefined;
  @Input() closeSliderPanel1: Function | undefined;
  @Input() closeIdentifier: string | undefined;
  // @Input() tripIdx: number
  @Input() slidepanelStatus: string | undefined;
  @Input() showClose: boolean = false;
  @Input() isAdminPage: boolean = false; //meals,baggage,seat,sports,prioritycheckin
  @Output() closeAction: EventEmitter<any> = new EventEmitter();

  @ViewChild('stickyDiv', { read: ElementRef, static: false }) el: any;
  @ViewChild('sllidePanel', { read: ElementRef, static: false }) sp: any;
  sliderOpen: boolean = false;
  positionSticky: boolean = false;
  windowHeight: number = window.innerHeight;
  @Input() hideScroll: boolean = false;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platform: any
  ) {
    if (isPlatformBrowser(this.platform)) {
      this.renderer.addClass(document.body, 'slider-opened');
      this.renderer.addClass(document.body, 'slider-opened-overflow');
      let win: Object = window;
      if (
        ((navigator && navigator.platform == 'MacIntel') ||
          (window && window.navigator.userAgent.indexOf('Mac') != -1)) &&
        !!win.hasOwnProperty('chrome')
      ) {
        this.renderer.addClass(document.body, 'slider-opened-mac');
      }
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (isPlatformBrowser(this.platform)) {
      this.renderer.removeClass(document.body, 'slider-opened');
      this.renderer.removeClass(document.body, 'slider-opened-overflow');
      this.renderer.removeClass(document.body, 'slider-opened-mac');
    }
  }

  ngAfterViewChecked() {}

  get closeSlidePanelFunct() {
    return this.closeSliderPanelAnimation.bind(this);
  }

  closeSliderPanelAnimation() {
    if (isPlatformBrowser(this.platform)) {
      this.slidepanelStatus = 'inactive';
      this.renderer.removeClass(document.body, 'slider-opened');
      if (this.closeSliderPanel) {
        setTimeout(() => {
          if (this.closeSliderPanel) this.closeSliderPanel();
          this.renderer.removeClass(document.body, 'slider-opened-overflow');
          this.renderer.removeClass(document.body, 'slider-opened-mac');
        }, 550);
      }
      if ((this, this.closeAction)) this.closeAction.emit('closed');
    }
  }

  onScroll(event: any) {
    if (isPlatformBrowser(this.platform)) {
      const scrollPosition = window.pageYOffset;
      const componentPosition = this.el ? this.el.nativeElement.offsetTop : 0;
      if (scrollPosition > componentPosition) {
        this.positionSticky = true;
      } else {
        this.positionSticky = false;
      }
    }
  }

  //EVENTS
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    if (isPlatformBrowser(this.platform)) {
      this.windowHeight = window.innerHeight;
    }
  }
}
