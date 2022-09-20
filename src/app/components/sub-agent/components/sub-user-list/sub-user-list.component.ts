import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SubAgentCurrencyLangHelper } from '../../helpers/currency-lang-helper';
import { ApiServiceSubAgent } from '../../services/api-service-sub-agent';
import { UserStateService } from '../../services/User-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sub-user-list',
  templateUrl: './sub-user-list.component.html',
  styleUrls: ['./sub-user-list.component.scss']
})
export class SubUserListComponent implements OnInit {

  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userStateService,this.translate);
  selectLangCode:any;
  selectCurrency:any;
  submitted = false;
  phoneInputObj: any;
  shimmer = true;
  errorMessage: boolean = false;
  staffList:any[] = [];
  createStaffForm: FormGroup;

  constructor(private userStateService: UserStateService,private translate: TranslateService,
    private activeRoute:ActivatedRoute,private service:ApiServiceSubAgent,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formValues();
    this.getLanguage();
  }

  formValues(){
    this.createStaffForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required,Validators.pattern('[0-9]+')]],
      password: ['', Validators.required],
      phn_country_code: ['966', Validators.required],
      tag: ['', Validators.required],
      role: ['EMPLOYEE'],
    });
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
    this.getList();
  }

  get f() { return this.createStaffForm.controls; }

  getList(){
    this.shimmer = true;
    this.service.getStaffList().subscribe((res:any)=>{
      this.shimmer = false;
      this.staffList = res.agency_staffs;
    })
  }

  telInputObject(obj) {
    this.phoneInputObj = obj;
  }

  onCountryChange(event) {
    this.createStaffForm.controls['phn_country_code'].setValue(event.dialCode);
  }

  inputValidation(event?) {
    this.errorMessage = false;
  }

  submit(){
    this.submitted = true;
    if (this.createStaffForm.invalid) {
      return;
    }

    this.service.postStaffList(this.createStaffForm.value).subscribe((res:any)=>{
      (<HTMLInputElement>document.getElementById("closeStaffCreateModal")).click();
      this.getList();
    },(err:any)=>{
      this.errorMessage = true;
    })

  }

}
