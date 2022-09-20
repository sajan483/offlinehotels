import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageEditorComponent } from '../../image-editor/image-editor.component';
import { debounceTime, map, startWith } from "rxjs/operators";
import { BranchApiService } from 'src/app/Services/branch-api-service';
import { isNumber } from 'util';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import * as _moment from 'moment';
import { CommonApiService } from 'src/app/Services/common-api-services';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';


const moment = (_moment as any).default ? (_moment as any).default : _moment;

export const MY_CUSTOM_FORMATS = {
  parseInput: 'LL LT',
  fullPickerInput: 'LL LT',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@Component({
  selector: 'app-visa-front-page',
  templateUrl: './visa-front-page.component.html',
  styleUrls: ['./visa-front-page.component.scss'],
  providers:[
    {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},

    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
  ]
})
export class VisaFrontPageComponent implements OnInit {
  @Input() appForm?: FormGroup;
  @Input() paxIndex: number = 0;
  @Input() submit:boolean;
  imgUrl = '';
  isPdf: boolean = false;
  hidden = false;
  showFiller = false;
  selectedGender: string = '';
  durationInSeconds = 5;
  sliderOpen: boolean = false;
  openHistory: boolean = false;
  paxForm: FormGroup = new FormGroup({});
  toDay = new Date();
  ageOfPax:number = 0;
  expiryDateRange:number = 0;
  @Input()
  nationalities:any[] = [ ];
  filteredNationalities: Observable<any[]>;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  constructor(
    private renderer2: Renderer2,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private service: BranchApiService,
    private spinner: NgxSpinnerService,
    private commonService:CommonApiService
  ) {}

  ngOnInit(): void {
    this.paxForm = <FormGroup>(<FormArray>this.appForm.controls["Pax"]).controls[this.paxIndex];
    this.trasilateArabic()
    this.filterNationalities();
  }
  

  filterNationalities(){
    let formA = this.appForm.controls['Pax'] as FormArray;
    this.filteredNationalities = (formA.at(this.paxIndex) as FormGroup).controls['NationalitySearch'].valueChanges.pipe(startWith(''),map((value)=>{
      return this.nationalities.filter((e)=>{
        return e.name.toLowerCase().includes(value.toLowerCase());
      });
    }));
  }


  trasilateArabic(){
    this.paxForm.controls.FirstName.valueChanges.pipe(debounceTime(1000)).subscribe(res=>{
      if(res!== ''){
        this.service.executeArabicTranslate(res).subscribe(val=>{     
          this.paxForm.controls.FirstNameArabic.patchValue(val)
      })
      }else if(res == '') this.paxForm.controls.FirstNameArabic.reset()
    })
    this.paxForm.controls.MiddleName.valueChanges.pipe(debounceTime(1000)).subscribe(res=>{
      if(res!== ''){
        this.service.executeArabicTranslate(res).subscribe(val=>{     
          this.paxForm.controls.MiddleNameArabic.patchValue(val)
      })
      }else if(res == '') this.paxForm.controls.MiddleNameArabic.reset()
    })
    this.paxForm.controls.LastName.valueChanges.pipe(debounceTime(1000)).subscribe(res=>{
      if(res!== ''){
        this.service.executeArabicTranslate(res).subscribe(val=>{     
          this.paxForm.controls.LastNameArabic.patchValue(val)
      })
      }else if(res == '') this.paxForm.controls.LastNameArabic.reset()
    })
    this.paxForm.controls.POB.valueChanges.pipe(debounceTime(1000)).subscribe(res=>{
      if(res!== ''){
        this.service.executeArabicTranslate(res).subscribe(val=>{     
          this.paxForm.controls.POBArabic.patchValue(val)
      })
      }else if(res == '') this.paxForm.controls.POBArabic.reset()
    })
    this.paxForm.controls.PIP.valueChanges.pipe(debounceTime(1000)).subscribe(res=>{
      if(res!== ''){
        this.service.executeArabicTranslate(res).subscribe(val=>{     
          this.paxForm.controls.PIPArabic.patchValue(val)
      })
      }else if(res == '') this.paxForm.controls.PIPArabic.reset()
    })

    //date of birth change calculate age
    this.paxForm.controls.DOB.valueChanges.subscribe(val=>{
      this.ageOfPax = this.calculateDiff(val,this.toDay)
    })
    this.paxForm.controls.DOE.valueChanges.subscribe(val=>{
      this.expiryDateRange = this.calculateDiff(this.toDay,val)
    })
  }

  calculateDiff(dateSent,currentDate){
    dateSent = new Date(dateSent);
    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24 * 365));
  }


  selectGender(g: string) {
    this.paxForm.controls.Gender.patchValue(g)
    this.selectedGender = g;
  }

  openSnackBar(message: string, action?: string) {
    var val = this.paxForm.controls['PassportNo'].value
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this._snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
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
        // if(result.file.size <= 1000000 && result.file.size >= 100000){
          this.paxForm.patchValue({
            passportFrontUrl:result.base64,
            passportFrontFile:result.file
          })
          this.imgUrl = result.base64;
          this.passportAutomationFrond(result.base64);
        // }else{
        //   Swal.fire({
        //     text: 'image size must be 100kb to 1Mb',
        //     icon: "warning",
        //     confirmButtonText: '0k',
        //   });
        // }
        
      }
    });
  }

  passportAutomationFrond(file:any){
    this.spinner.show();
    this.service.getPassportFrontAutomation(file).subscribe(data =>{
      this.spinner.hide();
      if(data.status == 'success'){
        this.pasteFrondData(data.passport_data)
      }
    },(error)=>{
      this.spinner.hide();
    })
  }

  pasteFrondData(data){
    let surname = data.result.surname;
    let firstname = data.result.given_name
    if(surname==''||surname==null||surname==undefined){
      let names = firstname.split('');
      if(names.length>0){
        firstname = names[0];
        surname = names[names.length];
      }else{
        surname = ''
      }
    }
    this.paxForm.patchValue({
      passportFrontMrz:data.mrz.raw_text,
      PassportNo:data.result.passport_number,
      FirstName:firstname,
      LastName:surname,
      Nationality:data.result.nationality,
      POB:data.result.pob,
      PIP:data.result.poi,
    })
    if(data.result.sex == 'M'){
      this.selectedGender = 'MALE';
      this.paxForm.controls.Gender.patchValue('MALE');
    }
    if(data.result.sex == 'F'){
      this.selectedGender = 'FEMALE';
      this.paxForm.controls.Gender.patchValue('FEMALE')
    }
    if(this.checkDateFormat(data.result.dob)){
      let date = this.convertDateFormat(data.result.dob);
      this.paxForm.controls.DOB.patchValue(new Date(date))
    }
    if(this.checkDateFormat(data.result.doi)){
      let date = this.convertDateFormat(data.result.doi);
      this.paxForm.controls.DOI.patchValue(new Date(date))
    }
    if(this.checkDateFormat(data.result.doe)){
      let date = this.convertDateFormat(data.result.doe);
      this.paxForm.controls.DOE.patchValue(new Date(date))
    }
  }

  convertDateFormat(date){
    var dd = date.split('/')[0];
    var mm = date.split('/')[1];
    var yy = date.split('/')[2];
    return mm+'/'+dd+'/'+yy
  }

  checkDateFormat(date){
    if(date.split('/').length == 3){
      var dd = date.split('/')[0];
      var mm = date.split('/')[1];
      var yy = date.split('/')[2];
      if(isNaN(+dd) || !isNumber(+dd) || dd > 31){
        return false
      }else if(isNaN(+mm) || !isNumber(+mm) || mm > 12){
        return false
      }else if(isNaN(+yy) || !isNumber(+yy)){
        return false
      }else{
        return true
      }
    }else{
      return false;
    }
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
