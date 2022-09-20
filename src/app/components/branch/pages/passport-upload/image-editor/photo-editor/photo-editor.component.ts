import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import Cropper from 'cropperjs';
import ViewMode = Cropper.ViewMode;
import fx from 'glfx';
import { MatSnackBar } from '@angular/material/snack-bar';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PhotoEditorComponent {
  public cropper: Cropper;
  public outputImage: string;
  prevZoom = 0;
  // @Input() modalTitle = 'Photo Editor';
  @Input() aspectRatio = 1;
  @Input() autoCropArea = 1;
  @Input() autoCrop = true;
  @Input() mask = true;
  @Input() guides = true;
  @Input() centerIndicator = true;
  @Input() viewMode: ViewMode = 0;
  @Input() modalSize: size;
  @Input() modalCentered = false;
  @Input() scalable = true;
  @Input() zoomable = true;
  @Input() cropBoxMovable = true;
  @Input() cropBoxResizable = true;
  @Input() darkTheme = true;
  @Input() roundCropper = false;
  @Input() canvasHeight = 400;
  @Input() canvasWidth = 500;
  @Input() resizeToWidth: number;
  @Input() resizeToHeight: number;
  @Input() imageSmoothingEnabled = true;
  @Input() imageSmoothingQuality: ImageSmoothingQuality = 'high';
  url: string;
  lastUpdate = Date.now();
  format = 'png';
  quality = 92;
  isFormatDefined = false;
  @Output() imageCropped = new EventEmitter<CroppedEvent>();
  @Output() closeDialog = new EventEmitter();
  @Input() disableCropperHeightCheck: boolean = false;
  
  advancedEditorImage = '';
  showAdvancedEditor: boolean = false;
  isMobile: boolean = false;
  edited: boolean = false;
  cropperWidth: number;
  cropperHeight: number;
  showCropper: boolean = true;
  fH: boolean = false;
  fV: boolean = false;
  
  pdfSrc = "";
  totalPages: number = 0;
  currentpage: number = 0;
  isPdfUploaded :boolean = false;
  
  ngOnInit(): void {
    if (Mobile(navigator.userAgent)) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  constructor(
    private _snackBar: MatSnackBar,
    ) {}

  @Input() set imageQuality(value: number) {
    if (value > 0 && value <= 100) {
      this.quality = value;
    }
  }

  @Input() set imageFormat(type: imageFormat) {
    if (/^(gif|jpe?g|tiff|png|webp|bmp)$/i.test(type)) {
      this.format = type;
      this.isFormatDefined = true;
    }
  }

  @Input() set imageUrl(url: string) {
    if (url) {
      this.url = url;
      if (this.lastUpdate !== Date.now()) {
        // this.open();
        this.lastUpdate = Date.now();
      }
    }
  }

  @Input() set file(file) {
    if (!file.isPdf) {
      this.url = file.fileData;
      this.pdfSrc = '';
      // this.onImageLoad(this.url);
    } else {
      this.pdfSrc = file.fileData;
      this.url = '';
      this.currentpage = 1;
    }
    this.isPdfUploaded = file.isPdf;
  }

  @Input() set imageBase64(base64: string) {
    if (base64 && /^data:image\/([a-zA-Z]*);base64,([^\"]*)$/.test(base64)) {
      this.imageUrl = base64;
      if (!this.isFormatDefined) {
        this.format = base64
          .split(',')[0]
          .split(';')[0]
          .split(':')[1]
          .split('/')[1];
      }
    }
  }

  @Input() set imageChanedEvent(event: any) {
    if (event) {
      const file = event.target.files[0];
      if (file && /\.(gif|jpe?g|tiff|png|webp|bmp)$/i.test(file.name)) {
        if (!this.isFormatDefined) {
          this.format = event.target.files[0].type.split('/')[1];
        }
        const reader = new FileReader();
        reader.onload = (ev: any) => {
          this.imageUrl = ev.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  }

  @Input() set imageFile(file: File) {
    if (file && /\.(gif|jpe?g|tiff|png|webp|bmp)$/i.test(file.name)) {
      if (!this.isFormatDefined) {
        this.format = file.type.split('/')[1];
      }
      const reader = new FileReader();
      reader.onload = (ev: any) => {
        this.imageUrl = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onImageLoad(image) {
    image.addEventListener('ready', () => {
      if (this.roundCropper) {
        (
          document.getElementsByClassName('cropper-view-box')[0] as HTMLElement
        ).style.borderRadius = '50%';
        (
          document.getElementsByClassName('cropper-face')[0] as HTMLElement
        ).style.borderRadius = '50%';
      }
    });

    this.cropper = new Cropper(image, {
      // aspectRatio: this.aspectRatio,
      aspectRatio: NaN,
      autoCropArea: this.autoCropArea,
      autoCrop: this.autoCrop,
      modal: this.mask, // black mask
      guides: this.guides, // grid
      center: this.centerIndicator, // center indicator
      viewMode: this.viewMode,
      scalable: this.scalable,
      zoomable: this.zoomable,
      cropBoxMovable: this.cropBoxMovable,
      cropBoxResizable: this.cropBoxResizable,
      zoomOnWheel: false,
      zoomOnTouch: false
    });

    setTimeout(() => {
      this.setCropperDimensions(false);
    }, 500);
    
  }

  rotateRight() {
    this.cropper.rotate(10);
    this.setEditedFlag();
  }

  rotateLeft() {
    this.cropper.rotate(-10);
    this.setEditedFlag();
  }

  crop() {
    this.cropper.setDragMode('crop');
    this.setEditedFlag();
  }

  // move() {
  //   this.cropper.setDragMode('move');
  // }

  zoom(event) {
    const value = Number(event.target.value);
    this.cropper.zoom(value - this.prevZoom);
    this.prevZoom = value;
    this.setEditedFlag();
  }

  zoomIn() {
    this.cropper.zoom(0.1);
    this.setEditedFlag();
  }

  zoomOut() {
    this.cropper.zoom(-0.1);
    this.setEditedFlag();
  }

  flipH() {
    this.cropper.scaleX(!this.fH? -1: 1);
    this.setEditedFlag();
    this.fH = !this.fH;
  }
  
  flipV() {
    this.cropper.scaleY(!this.fV? -1:1);
    this.setEditedFlag();
    this.fV = !this.fV;
  }

  reset() {
    this.cropper.reset();
    this.setEditedFlag(false);
  }

  moveX(left: boolean = true) {
    left ? this.cropper.move(-10, 0) : this.cropper.move(10, 0);
    this.setEditedFlag();
  }

  moveY(up: boolean = true) {
    up ? this.cropper.move(0, -10) : this.cropper.move(0, 10);
    this.setEditedFlag();
  }

  showCropperDiv(val) {
    this.showCropper = val;
    this.showAdvancedEditor = false;
  }

  setEditedFlag(value: boolean = true) {
    this.edited = value;
  }

setCropperDimensions(changeCanvasDimen: boolean = true) {
    let {width, height} = this.cropper.getCropBoxData();
    this.cropperWidth = width;
    this.cropperHeight = height;

    if(changeCanvasDimen) {
      this.canvasWidth = width;
      this.canvasHeight = height;
    }
  }

  applyCropperChanges() {
    let {width, height} = this.cropper.getCropBoxData();
    if(width<height && !this.disableCropperHeightCheck) {
      this.showErrorMessage();
    } else {
      if(width != this.cropperWidth || height != this.cropperHeight ) {
        this.setCropperDimensions();
        this.saveCropperChanges();
      } else if(width == this.cropperWidth && height == this.cropperHeight ) {
        if(this.edited) {
          this.setEditedFlag(false);
          this.saveCropperChanges();
        }
      }
    }
  }

  saveCropperChanges() {
    this.export(true);
    this.url = this.outputImage;
    this.cropper.destroy();
  }

  export(advancedEditorOpen: boolean = false) {
    let cropedImage;
    if (this.resizeToWidth && this.resizeToHeight) {
      cropedImage = this.cropper.getCroppedCanvas({
        width: this.resizeToWidth,
        imageSmoothingEnabled: this.imageSmoothingEnabled,
        imageSmoothingQuality: this.imageSmoothingQuality,
      });
    } else if (this.resizeToHeight) {
      cropedImage = this.cropper.getCroppedCanvas({
        height: this.resizeToHeight,
        imageSmoothingEnabled: this.imageSmoothingEnabled,
        imageSmoothingQuality: this.imageSmoothingQuality,
      });
    } else if (this.resizeToWidth) {
      cropedImage = this.cropper.getCroppedCanvas({
        width: this.resizeToWidth,
        imageSmoothingEnabled: this.imageSmoothingEnabled,
        imageSmoothingQuality: this.imageSmoothingQuality,
      });
    } else {
      cropedImage = this.cropper.getCroppedCanvas({
        imageSmoothingEnabled: this.imageSmoothingEnabled,
        imageSmoothingQuality: this.imageSmoothingQuality,
      });
    }
    this.outputImage = cropedImage.toDataURL(
      'image/' + this.format,
      this.quality
    );

    if (advancedEditorOpen) {
      return;
    }
    
    let i = new Image(); 
    i.onload = ()=>{
      if(i.height > i.width && !this.disableCropperHeightCheck) {
        this.showErrorMessage();
        return;
      } else {
        cropedImage.toBlob(
          (blob) => {
            this.imageCropped.emit({
              base64: this.outputImage,
              file: new File([blob], Date.now() + '.' + this.format, {
                type: 'image/' + this.format,
              }),
            });
          },
          'image/' + this.format,
          this.quality / 100
        );
      }
    };
    i.src = this.outputImage;
  }

  uploadPdf(file) {
    // let $img: any = document.querySelector('#upload-doc');
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e: any) => {
      this.pdfSrc = e.target.result;
      this.currentpage = 1;

      this.url = '';
      this.isPdfUploaded = true;
    };
  }
  
  uploadImage(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.url = <string>reader.result;
      this.cropper.destroy();

      this.pdfSrc = '';
      this.isPdfUploaded = false;   
    };
  }

  uploadFile(event) {
    let file = event.target.files[0];
    if (file) {
      if (
        file.type == 'image/png' ||
        file.type == 'image/jpg' ||
        file.type == 'image/jpeg'
      ) {
        this.uploadImage(file);
      } else
      if (file.type == 'application/pdf') {
        this.uploadPdf(file);
      } else {
        this._snackBar.open('Image should be of type .png, .jpg, .jpeg or .pdf', 'Ok', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 4000,
        });
      }
      event.target.value = '';
    }
  }

  cancel() {
    this.closeDialog.emit();
  }

  openAdvancedEditor() {
    this.resetSlider();
    if(!this.edited) {
      this.export(true);
      this.loadAdvancedEditor();
    } else {
      this.loadAdvancedEditor(true);
    }
  }

  toggleAdvancedEditor() {
    this.showAdvancedEditor = !this.showAdvancedEditor;
  }

  // advanced editor - glfx.js
  defaultCornerCoords = {
    topLeft: [0.0, 0.0],
    topRight: [1.0, 0.0],
    bottomLeft: [0.0, 1.0],
    bottomRight: [1.0, 1.0],
  };

  maxWidth = 500;
  maxHeight = null;
  canvas;
  texture;
  a = { x: 0, y: 0 };
  b = { x: 0, y: 0 };
  c = { x: 0, y: 0 };
  d = { x: 0, y: 0 };

  showErrorMessage() {
    this._snackBar.open('Cropper width should be greater than height','Ok',{
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 4000
    });
  }

  loadAdvancedEditor(edited: boolean = false) {
    let image = new Image();
    image.onload = () => {
      this.toggleAdvancedEditor();
      setTimeout(() => {
        this.init(image);
      });
    };
    if(edited) {
      image.src = this.url;
    } else {
      image.src = this.outputImage;
    }
  }

  context;
  init(image) {
    const smallCanvas = this.createSmallCanvas(
      image,
      this.maxWidth,
      this.maxHeight
    );

    let c = document.getElementById('image-original') as any;
    let context = c.getContext('2d');
    c.width = smallCanvas.width;
    c.height = smallCanvas.height;

    this.maxWidth = c.width;
    this.maxHeight = c.height;

    this.a = { x: 0, y: 0 };
    this.b = { x: this.maxWidth, y: 0 };
    this.c = { x: 0, y: this.maxHeight };
    this.d = { x: this.maxWidth, y: this.maxHeight };

    context.drawImage(smallCanvas, 0, 0, smallCanvas.width, smallCanvas.height);
    this.context = context;

    let placeholder = document.getElementById('placeholder') as any;

    try {
      this.canvas = fx.canvas();
    } catch (e) {
      placeholder.innerHTML = e;
      return;
    }

    this.texture = this.canvas.texture(smallCanvas);
    this.canvas.draw(this.texture).update().replace(placeholder);
    this.canvas.draw(this.texture).update();
    this.applyEffects();
  }

  point1;
  point2;
  point3;
  point4;

  pointMoved(event, point) {
    let { x, y } = event.source.getFreeDragPosition();
    switch (point) {
      case 1:
        this.a = event.source.getFreeDragPosition();
        this.point1 = event.source._dragRef;
        break;
      case 2:
        this.b = { x: this.maxWidth + x, y: y };
        this.point2 = event.source._dragRef;
        break;
      case 3:
        this.c = { x: x, y: this.maxHeight + y };
        this.point3 = event.source._dragRef;

        break;
      case 4:
        this.d = { x: this.maxWidth + x, y: this.maxHeight + y };
        this.point4 = event.source._dragRef;
        break;
    }
    this.applyEffects();
  }

  createSmallCanvas = (source, maxWidth, maxHeight) => {
    const sourceW = source.width;
    const sourceH = source.height;

    const wToHRatio = sourceH / sourceW;
    const hToWRatio = sourceW / sourceH;

    if (!maxWidth) maxWidth = source.width;
    if (!maxHeight) maxHeight = source.height;

    let targetW = maxWidth;
    let targetH = targetW * wToHRatio;

    if (sourceH > maxHeight) {
      targetH = maxHeight;
      targetW = targetH * hToWRatio;
    }

    const smallCanvas = document.createElement('canvas');
    const ctx = smallCanvas.getContext('2d');
    smallCanvas.width = targetW;
    smallCanvas.height = targetH;

    ctx.drawImage(source, 0, 0, sourceW, sourceH, 0, 0, targetW, targetH);

    return smallCanvas;
  };
  // advanced editor

  saveAdvancedEditorImage() {
    this.imageCropped.emit({
      base64: this.advancedEditorImage,
    });
  }

  brightnessValue: number = 0;
  contrastValue: number = 0;
  hueValue: number = 0;
  saturationValue: number = 0;

  sliderChange(event, id) {
    switch (id) {
      case 1:
        this.brightnessValue = event;
        break;
      case 2:
        this.contrastValue = event;
        break;
      case 3:
        this.hueValue = event;
        break;
      case 4:
        this.saturationValue = event;
        break;
    }
    this.applyEffects();
  }

  applyEffects() {
    this.canvas
      .draw(this.texture)
      .perspective(
        [
          this.a.x,
          this.a.y,
          this.b.x,
          this.b.y,
          this.c.x,
          this.c.y,
          this.d.x,
          this.d.y,
        ],
        [
          0,
          0,
          this.maxWidth,
          0,
          0,
          this.maxHeight,
          this.maxWidth,
          this.maxHeight,
        ]
      )
      .brightnessContrast(this.brightnessValue, this.contrastValue)
      .hueSaturation(this.hueValue, this.saturationValue)
      .update();
    this.advancedEditorImage = this.canvas.toDataURL('image/png');
  }

  applyAdvancedEffects() {
    this.applyEffects();
    this.url = this.advancedEditorImage;
    
    let image = new Image();
    image.onload = () => {
      // setTimeout(() => {
        const smallCanvas = this.createSmallCanvas(
          image,
          this.maxWidth,
          this.maxHeight
        );
        this.context.drawImage(smallCanvas, 0, 0, smallCanvas.width, smallCanvas.height);

        this.texture = this.canvas.texture(smallCanvas);
        this.canvas.draw(this.texture).update();
      // });
    };
    image.src = this.advancedEditorImage;

    this.resetPoints();
    this.resetSlider();
  }
  
  resetSlider() {
    this.brightnessValue = 0;
    this.contrastValue = 0;
    this.hueValue = 0;
    this.saturationValue = 0;
  }

  resetPoints() {
    this.a = { x: 0, y: 0 };
    this.b = { x: this.maxWidth, y: 0 };
    this.c = { x: 0, y: this.maxHeight };
    this.d = { x: this.maxWidth, y: this.maxHeight };

    if(this.point1) {
      this.point1.reset();
    }
    if(this.point2) {
      this.point2.reset();
    }
    if(this.point3) {
      this.point3.reset();
    }
    if(this.point4) {
      this.point4.reset();
    }
    
    this.point1 = undefined;
    this.point2 = undefined;
    this.point3 = undefined;
    this.point4 = undefined;
  }

  resetAdvancedEditor() {
    this.resetSlider();
    this.resetPoints();
    this.applyEffects();
  }

  downloadFile() {
    if (this.isPdfUploaded) {
      this.downloadPdf();
    } else {
      this.downloadImage();
    }
  }

  downloadImage() {
    let a = document.createElement("a");
    if(this.showAdvancedEditor) {
      this.applyEffects();
      a.href = this.advancedEditorImage;
    } else {
      this.export(true);
      a.href = this.outputImage;
    }
    a.download = "image.png";
    a.click();
    a.remove();
  }

  afterLoadComplete(pdf: any) {
    this.totalPages = pdf.numPages;
  }

  downloadPdf(selectImage: boolean = false) {
      let downloadPdfDiv = document.getElementById("download-pdf");
      
      html2canvas(downloadPdfDiv.getElementsByClassName("page")[0] as HTMLElement).then((canvas: any) => {
        this.getCanvasToDownload(canvas, selectImage)
      });
  }

  private getCanvasToDownload(canvas:any, selectImage: boolean = false){
    let ctx = canvas.getContext('2d');
    ctx.scale(3, 3);
    let image = canvas.toDataURL("image/png").replace("image/png", "image/png");
    if(selectImage) {
      this.url = image;
      this.isPdfUploaded = false;
      this.pdfSrc = '';
      return;
    }
    var link = document.createElement('a');
    link.download = "pdf-image.png";
    link.href = image;
    link.click();
    link.remove();
  }

  previous() {
    if (this.currentpage > 0) {
      if (this.currentpage == 1) {
        this.currentpage = this.totalPages;
      } else {
        this.currentpage--;
      }
    }
  }

  next() {
    if (this.totalPages > this.currentpage) {
      this.currentpage++;
    } else {
      this.currentpage = 1;
    }
  }

  selectPdfPageToCrop() {
    this.downloadPdf(true);
  }
}

export interface CroppedEvent {
  base64?: string;
  file?: File;
}

export type imageFormat = 'gif' | 'jpeg' | 'tiff' | 'png' | 'webp' | 'bmp';

export type size = 'sm' | 'lg' | 'xl' | string;

export function Mobile(userAgent) {
  let isMobile = {
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
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.IOS() || isMobile.Opera() || isMobile.Windows());
    }
  }

  return isMobile.any();
}
