import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Cropper from 'cropperjs';
import { CroppedEvent } from './photo-editor/photo-editor.component';
import ViewMode = Cropper.ViewMode;

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit {
  fileSource;
  imageChangedEvent: any;
  base64: any;
  disableCropperHeightCheck: boolean = false;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ImageEditorComponent>) {}

  ngOnInit(): void {
    this.fileSource = this.data.file;
    this.disableCropperHeightCheck = this.data.disableCropperHeightCheck? this.data.disableCropperHeightCheck: false;
  }
  
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
  }

  imageCropped(event: CroppedEvent) {
    this.base64 = event;
    this.dialogRef.close(this.base64);
  }

  closeDialog(event) {
    this.dialogRef.close();
  }
}
