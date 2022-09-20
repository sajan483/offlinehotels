import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BranchApiService } from 'src/app/Services/branch-api-service';
import { ImageEditorComponent } from '../../image-editor/image-editor.component';
import Swal from 'sweetalert2';
import { debounceTime } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-visa-back-page',
  templateUrl: './visa-back-page.component.html',
  styleUrls: ['./visa-back-page.component.scss']
})
export class VisaBackPageComponent implements OnInit {
  @Input() appForm?: FormGroup;
  @Input() paxIndex: number = 0;
  @Input() submit:boolean;
  imgUrl = '';
  isPdf: boolean = false;
  paxForm: FormGroup = new FormGroup({});

  @Input() isMobile: boolean = false;

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar,private service:BranchApiService,private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.paxForm = <FormGroup>(<FormArray>this.appForm.controls["Pax"]).controls[this.paxIndex];
    this.trasilateArabic()
  }

  trasilateArabic(){
    this.paxForm.controls.FatherName.valueChanges.pipe(debounceTime(1000)).subscribe(res=>{
      if(res!== ''){
        this.service.executeArabicTranslate(res).subscribe(val=>{     
          this.paxForm.controls.FatherNameArabic.patchValue(val)
      })
      }else if(res == '') this.paxForm.controls.FatherNameArabic.reset()
    })
    this.paxForm.controls.MotherName.valueChanges.pipe(debounceTime(1000)).subscribe(res=>{
      if(res!== ''){
        this.service.executeArabicTranslate(res).subscribe(val=>{     
          this.paxForm.controls.MotherNameArabic.patchValue(val)
      })
      }else if(res == '') this.paxForm.controls.MotherNameArabic.reset()
    })
    this.paxForm.controls.HusbandName.valueChanges.pipe(debounceTime(1000)).subscribe(res=>{
      if(res!== ''){
        this.service.executeArabicTranslate(res).subscribe(val=>{     
          this.paxForm.controls.HusbandNameArabic.patchValue(val)
      })
      }else if(res == '') this.paxForm.controls.HusbandNameArabic.reset()
    })
  }

  openImageEditor(file) {
    const dialogRef = this.dialog.open(ImageEditorComponent, {
      panelClass: 'full-screen-dialog',
      data: { file: {fileData: file, isPdf: this.isPdf }, disableCropperHeightCheck: true },
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.paxForm.patchValue({
          passportBackUrl:result.base64,
          passportBackFile:result.file
        })
        this.isPdf = false;
        if(result.file.size <= 1000000 && result.file.size >= 100000){
          this.imgUrl = result.base64;
          this.passportAutomationBack(result.base64)
        }else{
          Swal.fire({
            text: 'image size must be 100kb to 1Mb',
            icon: "warning",
            confirmButtonText: '0k',
          });
        }
        
      }
    });
  }

  passportAutomationBack(file:any){
    this.spinner.show();
    this.service.getPassportBackAutomation(file).subscribe(data =>{
      this.spinner.hide();
      if(data.status == 'success'){
        this.fetchDataValue(data.passport_data);
      }
    },(error)=>{
      this.spinner.hide();
    })
  }
  
  fetchDataValue(data){
    this.paxForm.patchValue({
      FatherName:data.father,
      MotherName:data.mother,
      Address:this.replaceSpecialChar(data.address),
      City:this.getCityNameInAddress(data.address),
      Country:this.getCountryInAddress(data.address),
    })
  }

  getCityNameInAddress(data){
    let val = data.split('\f')[1];
    let val2 = val.split(',')[1];
    return this.replaceSpecialChar(val2);
  }

  getCountryInAddress(data){
    let val = data.split('\f')[2];
    let val2 = val.split(',')[1];
    return this.replaceSpecialChar(val2);
  }

  replaceSpecialChar(data){
    return data.replaceAll('\n','').replaceAll('\f','')
  }

  editImage(img: HTMLImageElement) {
    this.openImageEditor(img.src);
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

  showErrorMessage() {
    this._snackBar.open('Image should be of type .png, .jpg, .jpeg or .pdf', 'Ok', {
      duration: 4000,
    });
  }
}
