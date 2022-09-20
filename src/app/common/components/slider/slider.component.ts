import { Component, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';


@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    ngOnInit(): void {

        this.galleryOptions = [
            {
                width: '100%',
                height: '300px',
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide
            },
            // max-width 800
            {
                breakpoint: 800,
                width: '100%',
                height: '600px',
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
            },
            // max-width 400
            {
                breakpoint: 400,
                preview: false
            }
        ];

        this.galleryImages = [
            {
                small: 'assets/images/aaaa.jpg',
                medium: 'assets/images/aaaa.jpg',
                big: 'assets/images/aaaa.jpg'
            },
            {
                small: 'assets/images/aaaa.jpg',
                medium: 'assets/images/aaaa.jpg',
                big: 'assets/images/aaaa.jpg'
            },
            {
                small: 'assets/images/aaaa.jpg',
                medium: 'assets/images/aaaa.jpg',
                big: 'assets/images/aaaa.jpg'
            }
        ];
    }
}
