import { Component, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-side-panel-up',
  templateUrl: './side-panel-up.component.html',
  styleUrls: ['./side-panel-up.component.scss']
})
export class SidePanelUpComponent implements OnInit {

  @Input() open: boolean = false;
  @Input() heading: string;
  @Input() type: string;
  @Output() close = new EventEmitter();
  classToAdd: string;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    if(Mobile(navigator.userAgent)) {
      this.classToAdd = 'remove-scroll-mobile';
    } else {
      this.classToAdd = 'remove-scroll';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.open) {
      this.renderer.addClass(document.body, this.classToAdd);
    }
  }

  closePanel() {
    this.open = false;
    this.close.emit();
    setTimeout(() => {
      this.renderer.removeClass(document.body, this.classToAdd);    
    }, 50);

  }

}

export function Mobile(userAgent) {
  var isMobile = {
    Android: function () {
      return userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return userAgent.match(/BlackBerry/i);
    },
    IOS: function () {
      return userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return userAgent.match(/IEMobile/i) || userAgent.match(/WPDesktop/i);
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.IOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };

  return isMobile.any();
}