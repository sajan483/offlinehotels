import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralHelper } from 'src/app/helpers/General/general-helpers';
import { SubAgentApiService } from 'src/app/Services/sub-agent-api-services';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { SegmentService } from 'ngx-segment-analytics';
import { NotificationService } from 'src/app/common/services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SubAgentCurrencyLangHelper } from '../../helpers/currency-lang-helper';
import { UserStateService } from '../../services/User-service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  details: any = {name:''};
  upgradebttn: boolean = false;
  genHelper: GeneralHelper;
  profileImage: any;
  imageFile: File;
  isprofileEdit: boolean;
  updateProfileForm: FormGroup;
  submitted = false;
  changePasswordForm:FormGroup;
  submitted2 = false;
  bttnLoader:boolean = false;
  incorrectpassword:boolean = false;
  showErrorText: string;
  oldpassworderror: boolean = false;
  prodUrl: string = "";
  baseUrl: string = environment.prodUrl;
  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userStateService,this.translate);
  selectLangCode:any;
  selectCurrency:any;

  constructor(private router: Router,private common: SubAgentApiService, private _gHelper: GeneralHelper,private translate: TranslateService,private formBuilder: FormBuilder,
    private segment:SegmentService,private notifyService:NotificationService,private userStateService: UserStateService,private activeRoute:ActivatedRoute) {
    this.genHelper = _gHelper;
  }

  ngOnInit() {
    this.formValidation()
    if (this.genHelper.getAccessTocken() == "") {
      this.router.navigate(["/login"]);
    } else {
      this.getLanguage();
    }
  }

  getLanguage(){
    this.activeRoute.params.subscribe(params =>{
      this.currencyLangHelper.changeLanguage(params.lang);
      this.currencyLangHelper.setCurrency(params.currency);
    })
    this.initialValues();
  }

  initialValues(){
    this.userStateService.globelCurrency.subscribe(t => this.selectCurrency = t);
    this.userStateService.globalLanguage.subscribe(t => this.selectLangCode = t);
    this.getValue()
    this.setUserDataForSegmentAnalysis()
    this.findProdUrlConfig()
  }

  setUserDataForSegmentAnalysis(){
    if(this.baseUrl  == this.prodUrl){
       window.analytics.page('subagent/profile',{
        user:localStorage.getItem("userTypeName"),
        userId:localStorage.getItem("userId"),
        portal:"B2B"
      });
    }
  }

  findProdUrlConfig(){
    const parsedUrl = new URL(window.location.href);
    this.baseUrl = parsedUrl.origin;
  }

  getValue(){
    this.common.getStaffDetails(sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.details = response;
      this.updateProfileForm.patchValue({
        name:this.details.name,
        phone_number:this.details.phone_number,
        email:this.details.email
      });
      sessionStorage.setItem("agentLogo",this.details.agency.logo_photo);
    });
  }

  formValidation(){
    this.updateProfileForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.changePasswordForm = this.formBuilder.group({
      old_password: ['', Validators.required],
      password1: ['',  [Validators.required, Validators.minLength(6)]],
      password2: ['', Validators.required]
    });
  }

  get f() { return this.updateProfileForm.controls; }

  get g() { return this.changePasswordForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.updateProfileForm.invalid) {
        return;
    }

    this.bttnLoader = true;

    this.common.updateProfile(this.updateProfileForm.value).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      if(this.baseUrl  == this.prodUrl){
        window.analytics.track('profile updated',{
        user:localStorage.getItem("userTypeName"),
        userId:localStorage.getItem("userId"),
        portal:"B2B",
        body:this.updateProfileForm.value,
        status:"success"
       });
      }
      this.bttnLoader = false;
      (<HTMLInputElement>document.getElementById("closeEditProfile")).click();
      this.getValue()
    })

  }

  onSubmitPassword(){
    this.incorrectpassword = false;
    this.oldpassworderror = false;
    this.submitted2 = true;
    if (this.changePasswordForm.invalid) {
      return;
    }

    if(this.changePasswordForm.controls.password1.value != this.changePasswordForm.controls.password2.value){
      this.incorrectpassword = true;
      return;
    }

    this.bttnLoader = true;

    this.common.changePassword(this.changePasswordForm.value).pipe(takeUntil(this.destroy$)).subscribe(res =>{
      if(this.baseUrl  == this.prodUrl){
        window.analytics.track('password changed',{
        portal:"B2B",
        user:localStorage.getItem("userTypeName"),
        userId:localStorage.getItem("userId"),
        body:this.changePasswordForm.value,
        status:"success"
       });
      }
      this.bttnLoader = false;
      (<HTMLInputElement>document.getElementById("changePasswordClose")).click();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Successfully Updated Password',
        showConfirmButton: false,
        timer: 1500
      })
    },(err)=>{
      this.bttnLoader = false;
      this.oldpassworderror = true;
    })
  }

  profileImageUpdate() {
    if (!this.bttnLoader) {
      this.bttnLoader = true;
      if (this.imageFile) {
        this.common.updateProfileImage(this.imageFile, this.details.agency.id).pipe(takeUntil(this.destroy$)).subscribe(res => {
          this.bttnLoader = false;
          this.getValue();
          (<HTMLInputElement>document.getElementById("changeLogoPopupClose")).click();
          this.notifyService.showSuccess("logo updated successfully");
        }, (err) => {
          this.bttnLoader = false;
          this.getValue();
          this.notifyService.showError("logo couldn't be updated");
        })
      }
    }
  }

  fileChangeEvent(fileInput: any) {
    this.showErrorText = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
        const max_size = 100000;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 780;
        const max_width = 3400;

        if (fileInput.target.files[0].size > max_size) {
            this.showErrorText =
                'Maximum size allowed is 100 kb';

            return false;
        }


        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width'];

                if (img_height > max_height || img_width > max_width) {
                    this.showErrorText =
                        'Maximum dimentions allowed ' +
                        max_height +
                        '*' +
                        max_width +
                        'px';
                    return false;
                } else {
                  this.imageFile = <File>fileInput.target.files[0];
                }
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);
    }
}

ngOnDestroy(){
  this.destroy$.next();
  this.destroy$.complete(); 
}

}
