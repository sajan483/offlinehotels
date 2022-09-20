import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ImageGalleryComponent } from '../../../../common/image-gallery/image-gallery.component';

@Component({
  selector: 'app-hotel-imge-details',
  templateUrl: './hotel-imge-details.component.html',
  styleUrls: ['./hotel-imge-details.component.scss']
})
export class HotelImgeDetailsComponent implements OnInit {

  @Input() details:any;
  @Input() hotelPics:any;
  @Input() nights:number = 0;
  @Input() roomCount:any;
  @Input() totalCount:any;
  @Input() ImageGallery:any;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  viewImages(){
    if(this.hotelPics.length > 0){
      // this.dialog.open(ImageGalleryComponent, { panelClass: 'custom-gallery-panel-class', data: {pics: this.hotelPics, name: this.details.name, rating: this.details.meta_data.rating } });
    }
  }

}
