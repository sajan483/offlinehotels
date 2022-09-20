import { Component, OnInit, Input } from "@angular/core";
import { OwlOptions } from "ngx-owl-carousel-o";
import { HotelDetailsPopupComponent } from '../hotel-details-popup/hotel-details-popup.component';
import { TransportComponent } from "../transport/transport.component";

@Component({
  selector: "app-hotel-image-popup",
  templateUrl: "./hotel-image-popup.component.html",
  styleUrls: ["./hotel-image-popup.component.scss"],
})
export class HotelImagePopupComponent implements OnInit {
  showHotelImages: boolean;
  hotelRating: any;
  imageshow: any;

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
  @Input() imagecollection: any;

  ngOnInit() {
    this.showHotelImages = true;
    this.hotelRating = 4;
    this.imageshow = 0;
  }

  closeHtlImgPopup() {
    HotelDetailsPopupComponent.imageView = false;
    TransportComponent.trnImageView = false;
  }
}