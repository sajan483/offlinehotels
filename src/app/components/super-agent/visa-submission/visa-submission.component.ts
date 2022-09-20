import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GroupnameValidator } from 'src/app/helpers/groupname_validator';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visa-submission',
  templateUrl: './visa-submission.component.html',
  styleUrls: ['./visa-submission.component.scss']
})
export class VisaSubmissionComponent implements OnInit {
  travellers = [];
  travellersCopy = [];

  shimmer = true;
  selectedTravellers = [];
  selectedTravellersO = [];
  selectedCountry = '';
  selectedCountryGrp = '';
  allTravellerSelected = false;
  countries = [
    {
      name: "INDIA",
      checked: false,
      username: 'UTindia',
      password: 'UTindia'
    },
    {
      name: "PAKISTAN",
      checked: false, username: 'UTpak',
      password: 'UTpak'
    },
    {
      name: "EGYPT",
      checked: false, username: 'UTegy',
      password: 'UTegy'
    }, {
      name: "BENGLADESH",
      checked: false, username: 'UTbengla',
      password: 'UTbengla'
    },
    {
      name: "INDONASIA",
      checked: false, username: 'UTindo',
      password: 'UTindo'
    },
    {
      name: "SUDAN",
      checked: false, username: 'UTsuda',
      password: 'UTsuda'
    },
    {
      name: "SREELANKA",
      checked: false, username: 'UTlanka',
      password: 'UTlanka'
    },
    {
      name: "TURKEY",
      checked: false, username: 'UTTurkey',
      password: 'UTTurkey'
    }
  ]
  packages = []
  providers = [
    "TAWAF",
    "BABEL UMRAH"
  ]
  showCreateGroupPopup = false;
  showLoginPopup = false;
  filteredPackages: ReplaySubject<any[]> = new ReplaySubject();
  filteredGroups: ReplaySubject<any[]> = new ReplaySubject();

  travellerSearchForm = this.fb.group({
    package: new FormControl('', Validators.required),
    packageSearch: new FormControl('')
  })
  groupForm = this.fb.group({
    'name': new FormControl("", [Validators.required, GroupnameValidator.cannotContainSpace, Validators.maxLength(20)]),
    'provider': new FormControl("", [Validators.required]),
    'providerSearch': new FormControl(""),
    'country':new FormControl("",[Validators.required])
  })
  assignGrpFrm = this.fb.group({
    'group': new FormControl("", [Validators.required]),
    'groupSearch': new FormControl("", []),
  })
  loginForm = this.fb.group({
    'username': new FormControl("", [Validators.required]),
    'password': new FormControl("", [Validators.required]),

  })
  travellersLoaded = true;
  totalPages = 1;
  currentPage = 1;
  toDay = new Date()
  selectedUtno = [];
  filteredProviders: Observable<any[]>;
  groups = [];
  mofaLogins = [];
  filteredLogins = [];
  credential:any;

  constructor(private fb: FormBuilder,private activatedRoute:ActivatedRoute,private superAgentApi:SuperAgentApiService) { }

  ngOnInit() {
    this.getMofaLogins();
    this.getPackages('');
    this.activatedRoute.params.subscribe((param)=>{
      if(param['id']){
        this.getTravellersForPackage();
        this.travellerSearchForm.controls.package.patchValue(
          'package1'
        )
      }
    });
    this.getGroups();
    this.travellerSearchForm.controls.packageSearch.valueChanges.pipe(startWith(''), map((value) => {
       this.superAgentApi.getPackageForDropdown(value,'').subscribe((data:any)=>{
        this.filteredPackages.next(data);
      });
    }));
    this.filteredProviders = this.groupForm.controls.providerSearch.valueChanges.pipe(startWith(''), map((value) => {
      return this.providers.filter((e) => {
        if(value!=undefined)
          return e.toLowerCase().includes(value.toLowerCase());
        else
          return true;
      });
    }));
    this.assignGrpFrm.controls.groupSearch.valueChanges.pipe(startWith(''),map((value)=>{
      if(this.groups.length>0)
        this.filteredGroups.next(this.groups.filter((e)=>e.title==value));
    }))
    this.getGroups();
  }

  onGroupCountrySelected(event){
    this.filteredLogins = [];
    this.credential = undefined;
    let selectedCountryGrp = this.groupForm.controls.country.value;
    if (selectedCountryGrp == event.name) {
      this.groupForm.controls.country.patchValue('')
    } else {
      selectedCountryGrp = event.name;
      this.filteredLogins = this.mofaLogins.filter((e)=>e.nationality.toLowerCase()==event.name.toLowerCase())
      this.groupForm.controls.country.patchValue(event.name)
    }
  }

  onTravellerSelected(index, event) {
    if (this.selectedCountry!="") {
      if (this.selectedCountry != this.travellers[index].nationality) {
        Swal.fire({
          title: "Oops!",
          icon: 'error',
          text: "Please select same nationality"
        });
        this.travellers[index].checked = false;
      } else {
        this.travellers[index].checked = event.checked;
      }
    } else {
      this.travellers[index].checked = event.checked;
      this.selectedCountry = this.travellers[index].nationality;
    }
    if (this.travellers.filter((e) => e.checked).length == 0) {
      this.selectedCountry = '';
    }
  }


  onCountrySelected(event) {
    if (this.selectedCountry == event.name) {
      this.selectedCountry = '';
      this.travellers = this.travellersCopy;
    } else {
      this.selectedCountry = event.name;
      this.travellers = this.travellersCopy.filter((event) => event.nationality == this.selectedCountry);
    }

  }


  createGroup() {
    if (this.groupForm.invalid) {
      return;
    } else {
      if(this.credential==undefined || this.credential.country.toLowerCase()!=this.groupForm.controls.country.value.toLowerCase()){
        if(this.filteredLogins.length>0){
          Swal.fire({
            title:"Oops!",
            icon:'error',
            text:"Please choose a valid credential"
          })
        }else{
          this.toggleLoginPopup();
        }
      }else{
        this.saveGroup();
      }
     
    }
  }

  saveGroup(){
    let data = {
      'group_name':this.groupForm.controls.name.value,
      'provider':this.groupForm.controls.provider,
      'country':this.groupForm.controls.country,
      'username':this.credential.username
    }
    this.superAgentApi.createGroup(data).subscribe((e:any)=>{
      if (e.status == 'failure') {
        let keys = Object.keys(e.msg);
        let msg = ''
        keys.forEach((key)=>{
          msg += key + " - " +e.msg[key] + "\n";
        })
        if(msg == ''){
          "Group Couldn't be created "
        }
        Swal.fire({
          title: "Success",
          icon: 'error',
          text: msg
        });
      } else {
        Swal.fire({
          title: "Success",
          icon: 'success',
          text: "Group created successfully"
        });
        this.toggleCreateGroup();
        this.groupForm.reset();
        this.getGroups();
      }
    })
  }

  getGroups(){
    this.superAgentApi.getGroups().subscribe((e:any)=>{
      this.groups = e
      this.filteredGroups.next(e);
    })
  }

  toggleLoginPopup() {
    this.showLoginPopup = !this.showLoginPopup;
  }

  get gf() {
    return this.groupForm.controls;
  }

  toggleCreateGroup() {
    this.showCreateGroupPopup = !this.showCreateGroupPopup;
  }

  onAllTravellersSelected(event) {
    if(this.selectedCountry=='' && event.checked){
      Swal.fire({
        title: "Oops!",
        icon: 'error',
        text: "Please choose a valid country"
      });
      event.checked = false;
      this.allTravellerSelected = false;
    }else{
      if (this.travellers.filter((e) => this.selectedCountry.toLowerCase() == e.nationality.toLowerCase()).length > 0) {
        this.travellers.forEach((e) => {
          if (this.selectedCountry.toLowerCase() == e.nationality.toLowerCase()) {
            e.checked = event.checked;
          }
        })
      } else {
        event.checked = false;
        this.allTravellerSelected = false;
      }
    }
  }

  loginToTawaf() {

    if (!this.loginForm.valid) {
      Swal.fire({
        title: "Oops!",
        icon: 'error',
        text: "Sorry! Please check all the fields"
      })
    } else {
      let data = {
        country:this.selectedCountry,
        provider:this.groupForm.controls.provider.value,
        username:this.loginForm.controls.username.value,
        password:this.loginForm.controls.password.value
      };
      this.createMofa(data);
    }
  }

  get lf() {
    return this.loginForm.controls;
  }

  getTravellersForPackage() {
    this.travellersLoaded = true;
    for (let i = 0; i < 10; i++) {
      this.travellers.push({
        ut_no: "UT441" +  (i == 2 || i == 3 ? 2:i),
        book_date: Date.now(),
        travel_date: Date.now(),
        submit_date: Date.now(),
        id: i + 1,
        checked: false,
        group_id: "GRP" + ((i + 2) * 123),
        status: "PROCESSING",
        tawaf_status: "PROCESSING",
        payment_status: 'PAID',
        group_name: "GRP" + ((i + 2) * 123),
        nationality: i == 2 || i == 3 ? 'SUDAN' : 'INDIA'
      });
      this.travellersCopy.push({
        ut_no: "UT441" + i,
        book_date: Date.now(),
        travel_date: Date.now(),
        submit_date: Date.now(),
        payment_status: 'PAID',
        id: i + 1,
        group_id: "GRP" + ((i + 2) * 123),
        status: "PROCESSING",
        tawaf_status: "PROCESSING",
        group_name: "GRP" + ((i + 2) * 123),
        checked: false,
        nationality: i == 2 || i == 3 ? 'SUDAN' : 'INDIA'
      });
    }
    setTimeout(() => {
      this.shimmer = false;
    }, 1000)
  }

  getPackages(search){
      return this.superAgentApi.getPackageForDropdown(search,'').subscribe((e:any)=>{
        this.packages=e;
        this.activatedRoute.params.subscribe((d)=>{
          if(d['id']){
            let packages = this.packages.filter((e:any)=>e.id==d['id'])
            if(packages.length>0){
              this.travellerSearchForm.controls.package.patchValue(packages[0]);
            }
          }
        })
      
      })
  }

  getSelectedTravellersUTNo(){
    this.selectedTravellersO = this.travellers.filter((e)=>e.checked);
    this.selectedTravellersO.forEach((e)=>{
      if(!this.selectedUtno.includes(e.ut_no)){
        this.selectedUtno.push(e.ut_no)
      }
    });
  }

  getMofaLogins(fromMofaCreate=false){
    this.superAgentApi.getMofa().subscribe((e:any)=>{
      this.mofaLogins = e;
      if(fromMofaCreate){
        this.credential = this.mofaLogins.filter((e)=>e.username==this.loginForm.controls.username.value)[0]
        this.saveGroup();
      }
    })
  }

  onCredentialSelected(event){
    this.credential = event;
  }


  createMofa(data) {
    this.superAgentApi.createMofa(data).subscribe((e: any) => {
      if (e.status == 'failure') {
        let keys = Object.keys(e.msg);
        let msg = ''
        keys.forEach((key)=>{
          msg += key + " - " +e.msg[key] + "\n";
        })
        if(msg == ''){
          "Mofa Credential couldn't be created "
        }
        Swal.fire({
          title: "OOps!",
          icon: 'error',
          text: msg
        });
      } else {
        this.getMofaLogins(true);
      }
    })
  }

  assignToGroup(){
    if(this.assignGrpFrm.controls.group.value==''){
      Swal.fire({
        title: "Oops!",
        icon: 'error',
        text: "Please select group"
      });
    }else if(this.selectedTravellers.length==0){
      Swal.fire({
        title: "Oops!",
        icon: 'error',
        text: "Please select one or more travellers"
      });
    }else{
      this.getGroups();
    }
  }
  
}
