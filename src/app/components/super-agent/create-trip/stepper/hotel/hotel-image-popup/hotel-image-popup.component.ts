import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { OwlOptions } from "ngx-owl-carousel-o";

@Component({
  selector: 'app-hotel-image-popup',
  templateUrl: './hotel-image-popup.component.html',
  styleUrls: ['./hotel-image-popup.component.scss']
})
export class HotelImagePopupComponent implements OnInit {
  showHotelImages: boolean;
  hotelRating: any;
  imageshow: any;
  @Output() showHotelImgEmitter = new EventEmitter();

  customOptions: OwlOptions = {
    loop: true,
    autoWidth: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ["&#8249;", "&#8250;"],
    responsive: {
      0: {
        items: 3,
      },
      400: {
        items: 4,
      },
      740: {
        items: 6,
      },
      940: {
        items: 10,
      },
    },
    nav: true,
  };

  constructor() {}
  @Input()hotelPics;

  ngOnInit() {
    window.scrollTo(0,0)
    this.showHotelImages = true;
    this.hotelRating = 4;
    this.imageshow = 0;
  }

  closeHtlImgPopup() {
    this.showHotelImages = false;
    this.showHotelImgEmitter.emit('hide');
  }
  
}
