import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { BranchAdapter } from 'src/app/adapters/super-agent/branch-adapter';
import { NotificationService } from 'src/app/common/services/notification.service';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { AppStore } from 'src/app/stores/app.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-staff-creation',
  templateUrl: './staff-creation.component.html',
  styleUrls: ['./staff-creation.component.scss']
})
export class StaffCreationComponent implements OnInit,OnDestroy {
  options = false;
  private destroy$ = new Subject();
  AgentStaffRegisterForm: FormGroup;
  submitted = false;
  branchlists: any[] = [];
  branchAdapter:BranchAdapter;
  superAgentApiService:SuperAgentApiService;
  agencyId: any;
  bttnactive:boolean =false;
  phoneNumber: string ="";
  phone_error: boolean = false;
  activateCreateLinkBtn: boolean = false;
  countryCode: any = environment.countryCodeCommen;

  constructor(private route:Router,private _SuperAgentService:SuperAgentApiService,private notifyService:NotificationService,
    private appStore:AppStore) { 
    this.branchAdapter = new BranchAdapter();
    this.superAgentApiService=this._SuperAgentService;
  }

  ngOnInit() {
    this.agencyId = sessionStorage.getItem("agency_Id");
    this.AgentStaffRegisterForm = this.branchAdapter.agentStaffCreationForm();
    this.AgentStaffRegisterForm.controls.phn_country_code.setValue(this.countryCode)
    this.getBranchList();
  }

  /**
   * This method for getting all branch lists
   */
  getBranchList(){
    this.superAgentApiService.getBranchlist(this.appStore.langCode).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.branchlists = data;
    })
  }

  get f() { return this.AgentStaffRegisterForm.controls; }

  /**
   * This method for submitting staff details
   */
  onSubmit() {
    this.submitted = true;
    if (this.AgentStaffRegisterForm.invalid) {
      return;
    }
    this.bttnactive = true;
    this.staffCreation();
  }

  staffCreation(){
    this.superAgentApiService.staffRegister(this.AgentStaffRegisterForm.value).pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.notifyService.showSuccess("Success !!");
      this.navigateStaffList();
      this.bttnactive = false;
    },error=>{
      this.notifyService.showError("staff with this phone number already exists.");
      this.bttnactive = false;
    })
  }

  navigateStaffList(){
    this.route.navigate(['/superagent/staff_list']);
  }

  validateNumber() {
    try {
      if (this.AgentStaffRegisterForm && this.AgentStaffRegisterForm.controls['phone_number'].value) {
        let mobileNumber = this.AgentStaffRegisterForm.controls['phone_number'].value;
        if (this.getNumberPlaceHolderLength() && this.getNumberPlaceHolderLength() != mobileNumber.length) {
          this.phone_error = true;
          this.activateCreateLinkBtn = false
        }else{
          this.phone_error = false;
          this.activateCreateLinkBtn = true
        }
      }
    } catch (exception) {
      this.phone_error = false;
      alert('Enter mobile number')
    }
  }

  getNumberPlaceHolderLength(): number {
    try {
      let phoneInput: HTMLElement = document.getElementById("phoneInput");
      if (phoneInput)
        return phoneInput.attributes.getNamedItem("placeholder").value.replace(/[^0-9a-zA-Z]/g, '').length;
    } catch (exception) {
    }
  }

  onCountryChange(event) {
    this.countryCode = event.dialCode
    this.AgentStaffRegisterForm.controls.phn_country_code.setValue(event.dialCode)
    this.validateNumber()
  }

  inputValidation(event?) {
    let defaultCountryCode: string = "+91"
        try {
          let mobileNumber: string = '';
          if (event)
            mobileNumber = event.srcElement.value;
          else
            mobileNumber = this.AgentStaffRegisterForm.controls.phone_number.value;
          defaultCountryCode = defaultCountryCode.replace(/[^0-9]/g, '');
          if (this.getNumberPlaceHolderLength() && mobileNumber.length >= this.getNumberPlaceHolderLength() + defaultCountryCode.length &&
            mobileNumber.startsWith(defaultCountryCode)) {
            mobileNumber = mobileNumber.slice(defaultCountryCode.length);
          }
          else if (mobileNumber.startsWith('0'))
            mobileNumber = mobileNumber.slice(1);
            this.AgentStaffRegisterForm.controls.phone_number.setValue(mobileNumber)
          this.validateNumber();
        } catch (exception) {
        }
      }
      ngOnDestroy(){
        this.destroy$.next();
        this.destroy$.complete(); 
       }

}