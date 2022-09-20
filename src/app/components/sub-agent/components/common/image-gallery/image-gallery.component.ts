import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ViewChild,
  NgZone,
  Renderer2,
  OnDestroy,
  ElementRef,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { debounceTime, filter, throttleTime } from "rxjs/operators";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";

interface GalleryItem {
  image: string;
  thumbnail: string;
  category: string;
  title: string;
}
interface GalleryClientCategory {
  el: ElementRef;
  rect: DOMRect;
}
interface RawImage {
  path: string;
  parentIndex?: number;
}

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit {
  math = Math;
  private groupedData = {};
  categories: string[] = [];
  private categoriesClient: GalleryClientCategory[] = [];
  @ViewChildren("categoryItem") categoryDOMList: QueryList<ElementRef>;
  @ViewChild("categoryUl", { static: false }) categoryUl: ElementRef;
  rawImages: RawImage[] = [];
  rawImageIndex = 0;
  @ViewChild("rawImagesWrapper", { static: false })
  rawImagesWrapper: ElementRef;
  @ViewChild("rawImagesUl", { static: false }) rawImagesUl: ElementRef;
  @ViewChildren("rawImageLi") rawImageList: QueryList<ElementRef>;
  @ViewChild("thumbnailWrapper", { static: false })
  thumbnailWrapper: ElementRef;
  @ViewChild("thumbnailUl", { static: false }) thumbnailUl: ElementRef;
  @ViewChildren("thumbnailLi") thumbList: QueryList<ElementRef>;
  private thumbnailsClient: GalleryClientCategory[] = [];

  payloadSubscription: Subscription;
  keyboardEventSubscription: Subscription;
  public loading = false;
  _eventTrackSub: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platform: any,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private zone: NgZone,
    private dialogRef: MatDialogRef<ImageGalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public hotelDetails: any
  ) {}

  ngOnInit() {
    this.prepareData(this.hotelDetails.pics);
    if (isPlatformBrowser(this.platform)) {
      this.renderer.addClass(document.body, "gallery-opened");
      this.keyboardEventSubscription = fromEvent<KeyboardEvent>(
        document,
        "keydown"
      )
        .pipe(
          throttleTime(300),
          filter((x) => x.keyCode == 39 || x.keyCode == 37)
        )
        .subscribe((x) => {
          if (x.keyCode == 37) {
            this.prevSlide();
          } else {
            this.nextSlide();
          }
        });
    }
  }

  closeGallery() {
    this.dialogRef.close();
  }

  nextThumb() {
    const windowWidth = this.getWindowWidth();
    const left = this.thumbnailWrapper.nativeElement.scrollLeft;
    this.scrollThumbWrapper(left + windowWidth / 2);
  }

  private scrollThumbWrapper(unit) {
    this.smoothScroll(this.thumbnailWrapper.nativeElement, unit);
  }

  prevThumb() {
    const windowWidth = this.getWindowWidth();
    const left = this.thumbnailWrapper.nativeElement.scrollLeft;
    if (left > 0) {
      this.scrollThumbWrapper(left - windowWidth / 2);
    }
  }

  thumbnailTapped(i) {
    this.rawImageIndex = i;
    this.animateRawSlide();
    this.toggleThumbnailActiveClass(i);
    const windowWidth = this.getWindowWidth();
    const rect = this.thumbnailsClient[i].rect;
    this.smoothScroll(
      this.thumbnailWrapper.nativeElement,
      rect.x - windowWidth / 2
    );
  }

  private toggleThumbnailActiveClass(i: number) {
    this.thumbnailsClient.forEach((x) => {
      x.el.nativeElement.classList.remove("active");
    });
    this.thumbnailsClient[i].el.nativeElement.classList.add("active");
  }

  prevSlide() {
    if (this.rawImageIndex > 0) {
      this.rawImageIndex--;
      this.onSlideChange();
    }
  }

  nextSlide() {
    if (this.rawImages.length - 1 > this.rawImageIndex) {
      this.rawImageIndex++;
      this.onSlideChange();
    }
  }

  private onSlideChange() {
    this.animateRawSlide();
    this.toggleThumbnailActiveClass(this.rawImageIndex);
    const windowWidth = this.getWindowWidth();
    const rect = this.thumbnailsClient[this.rawImageIndex].rect;
    this.smoothScroll(
      this.thumbnailWrapper.nativeElement,
      rect.x - windowWidth / 2
    );
  }

  private animateRawSlide() {
    const constWidth = this.getWindowWidth();
    const left = constWidth * this.rawImageIndex;
    this.rawImagesUl.nativeElement.style.marginLeft = `-${left}px`;
  }

  private smoothScroll(el, unit) {
    el.scroll({
      top: 0,
      left: unit,
      behavior: "smooth",
    });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platform)) {
      this.renderer.removeClass(document.body, "gallery-opened");
    }
    if (this.payloadSubscription) {
      this.payloadSubscription.unsubscribe();
    }
    if (this.keyboardEventSubscription) {
      this.keyboardEventSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      fromEvent(window, "resize")
        .pipe(debounceTime(300))
        .subscribe(() => {
          this.restartSlider();
        });
    });
    setTimeout(() => {
      this.prepareView();
    }, 50);
  }

  private prepareView() {
    if (this.thumbList == null || this.thumbList.toArray().length == 0) {
      this.loading = false;
      this.closeGallery();
      return;
    }

    this.prepareCategoryDOM();
    this.prepareThumbDOM();
    this.prepareRawDOM();
  }

  private prepareRawDOM() {
    const width = this.getWindowWidth();
    this.rawImagesUl.nativeElement.style.width = `${
      width * this.rawImages.length
    }px`;
    this.rawImageList.forEach((i) => {
      i.nativeElement.style.width = `${width}px`;
    });
  }

  private prepareThumbDOM() {
    this.thumbList.forEach((x) => {
      this.thumbnailsClient.push({
        el: x,
        rect: x.nativeElement.getBoundingClientRect(),
      });
    });
  }

  private prepareCategoryDOM() {
    this.categoryDOMList.forEach((i) => {
      this.categoriesClient.push({
        el: i,
        rect: i.nativeElement.getBoundingClientRect(),
      });
    });
  }

  private getWindowWidth(): number {
    return window.innerWidth;
  }

  private restartSlider() {
    this.prepareView();
    setTimeout(() => {
      this.rawImageIndex = 0;
    });
    this.animateRawSlide();
    this.scrollThumbWrapper(0);
    this.toggleThumbnailActiveClass(0);
  }

  private getKeys(obj): string[] {
    return Object.keys(obj);
  }

  private prepareData(raw: any[]) {
    let parentIndex = 0;
    raw.forEach((i, index) => {
      const item = i;
      this.rawImages.push({
        path: item.image_url,
      });
    });
  }
}
