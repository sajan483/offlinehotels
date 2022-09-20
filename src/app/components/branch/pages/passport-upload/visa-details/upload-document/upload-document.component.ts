import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  Input
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageEditorComponent } from '../../image-editor/image-editor.component';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { VisaStateService } from 'src/app/Services/visa-service/visa-state-service';
import { VisaAdapter } from 'src/app/adapters/visa/visaAdapter';
@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {
  @ViewChild('uploadImg',{static:true}) fileInput: ElementRef<HTMLElement>;
  allDocs = [];
  currentFilesSize = 0;
  allowedSizeInMb = 1;
  fileSizeLimit;
  base64Array = [];
  editFlag: boolean = false;
  editIndex = undefined;
  isPdf: boolean = false;
  serviceCode: number;
  personalImg = '';
  vaccinationCertificate = '';
  @Input() appForm?: FormGroup;
  @Input() paxIndex: number = 0;
  @Input() submit:boolean;
  paxForm: FormGroup = new FormGroup({});
  private visaAdapter: VisaAdapter = new VisaAdapter(this.fb, this.visaState);
  additionalDocArray: FormGroup;

  constructor(private _snackBar: MatSnackBar, public dialog: MatDialog,private fb: FormBuilder,private visaState:VisaStateService) {}

  ngOnInit(): void {
    this.paxForm = <FormGroup>(<FormArray>this.appForm.controls["Pax"]).controls[this.paxIndex];
    this.fileSizeLimit = this.allowedSizeInMb * 1024 * 1024;
  }

  openImageEditor(file, index = 0) {
    const dialogRef = this.dialog.open(ImageEditorComponent, {
      panelClass: 'full-screen-dialog',
      data: { file: {fileData: file, isPdf: this.isPdf }, disableCropperHeightCheck: true },
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isPdf = false;
        if(this.serviceCode == 3){
          if (this.editFlag) {
            if (this.editIndex != undefined) {
              let docArrayForm = <FormGroup>(<FormArray>this.paxForm.controls["AdditionalDocUrl"]).controls[this.paxIndex];
              docArrayForm.patchValue({
                docData:result.base64,
                docDataFile:result.file
              })
              this.base64Array[this.editIndex] = result.base64;
              this.editIndex = undefined;
            } else {
              let docArrayForm = <FormGroup>(<FormArray>this.paxForm.controls["AdditionalDocUrl"]).controls[index];
              docArrayForm.patchValue({
                docData:result.base64,
                docDataFile:result.file
              })
              this.base64Array[index] = result.base64;
            }
            this.editFlag = false;
          } else {
            this.documentLoopFormArray().push(this.visaAdapter.addAdditionalUrl(result.base64,result.file))
            this.base64Array.push(result.base64);
          }
        }else if(this.serviceCode == 2){
          if(result.file.size <= 1000000000 && result.file.size >= 4000){
            this.paxForm.patchValue({
              vaccinationCertificate:result.base64,
              vaccinationCertificateFile:result.file
            })
            this.vaccinationCertificate = result.base64;
          }else{
            Swal.fire({
              text: 'image size must be 4kb to 1MB',
              icon: "warning",
              confirmButtonText: '0k',
            });
          }
        }else if(this.serviceCode == 1){
          if(result.file.size <= 1000000000 && result.file.size >= 4000){
            this.paxForm.patchValue({
              PersonalPhotoUrl:result.base64,
              PersonalPhotoFile:result.file
            })
            this.personalImg = result.base64;
          }else{
            Swal.fire({
              text: 'image size must be 4kb to 1MB',
              icon: "warning",
              confirmButtonText: '0k',
            });
          }
        }
      }else {
        this.editFlag = false;
        this.editIndex = undefined;
      }
     });
  }

  documentLoopFormArray() : FormArray{
    return this.paxForm.get("AdditionalDocUrl") as FormArray
  }

  uploadImage(event) {
    const reader = new FileReader();

    if (event.target.files[0]) {
      if (
        event.target.files[0].type == 'image/png' ||
        event.target.files[0].type == 'image/jpg' ||
        event.target.files[0].type == 'image/jpeg'
      ) {
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
          // let image = new Image();
          // image.src = ;
          this.isPdf = false;
          this.openImageEditor(<string>reader.result);
        };
      } else if(event.target.files[0].type == 'application/pdf' ){
        reader.readAsArrayBuffer(event.target.files[0]);
        reader.onload = (e: any) => {
          this.isPdf = true;
          this.openImageEditor(e.target.result);
        };
      }
      event.target.value = '';
    }
  }

  removeFile(index) {
    this.documentLoopFormArray().removeAt(index);
    this.base64Array.splice(index, 1);
  }

  openFileUpload(service:number,update = false, index = 0) {
    this.serviceCode = service;
    if (update) {
      this.editFlag = true;
      this.editIndex = index;
    } else {
      this.editFlag = false;
      this.editIndex = undefined;
    }
    this.fileInput.nativeElement.click();
  }

  editImage(index,img) {
    const reader = new FileReader();
    if(this.serviceCode == 3){
      this.openImageEditor(<string>this.base64Array[index], index);
    }else{
      this.openImageEditor(img,null);
    }
    this.editFlag = true;
    this.editIndex = undefined;
  }

}
