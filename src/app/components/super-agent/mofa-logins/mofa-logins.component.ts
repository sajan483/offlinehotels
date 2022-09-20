import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonApiService } from 'src/app/Services/common-api-services';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mofa-logins',
  templateUrl: './mofa-logins.component.html',
  styleUrls: ['./mofa-logins.component.scss']
})
export class MofaLoginsComponent implements OnInit {

  filteredCountries: Observable<any[]>;
  filteredProviders: Observable<any[]>;

  providers = [
    "TAWAF",
    "BABEL UMRAH"
  ]
  createMofaForm = this.fb.group({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),
    provider: new FormControl('',[Validators.required]),
    country: new FormControl('',[Validators.required]),
    countrySearch: new FormControl(''),
    providerSearch: new FormControl(''),
    tags: new FormControl([])
  })
  shimmer = true;
  logins = []
  nationalities = [];
  showCredentialForm = false;
  showEditBtn = false;
  updateLoginData:any;

  constructor(private fb: FormBuilder, private commonServices: CommonApiService, private superAgentApiService: SuperAgentApiService) { }

  getNationalities() {
    this.commonServices.getNationality("", "en-US").subscribe((data) => {
      this.nationalities = data;
      this.filteredCountries = this.createMofaForm.controls.countrySearch.valueChanges.pipe(startWith(''), map((value) => {
        return this.nationalities.filter((e) => {
          if(value!=undefined)
            return e.name.toLowerCase().includes(value.toLowerCase());
          return true;
        });
      }));
    });
  }

  ngOnInit() {
    this.getNationalities();
    this.filteredProviders = this.createMofaForm.controls.provider.valueChanges.pipe(startWith(''), map((value) => {
      return this.providers.filter((e) => {
        if(value)
          return e.toLowerCase().includes(value.toLowerCase());
        return false;
      });
    }));
    this.getMofaLogins();
  }


  createMofa() {
    let data = {
      username: this.createMofaForm.value.username,
      password: this.createMofaForm.value.password,
      provider: this.createMofaForm.value.provider.toLowerCase(),
      country: this.createMofaForm.value.country,
      tags: this.createMofaForm.value.tags.map((d) => d.value)
    }
    this.superAgentApiService.createMofa(data).subscribe((e: any) => {
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
          title: "Success",
          icon: 'error',
          text: msg
        });
      } else {
        Swal.fire({
          title: "Success",
          icon: 'success',
          text: "Mofa Credential created successfully"
        });
        this.toggleCredentialForm();
        this.createMofaForm.reset();
        this.getMofaLogins();
      }
    })
  }

  updateMofa() {
    let data = {
      username: this.createMofaForm.value.username,
      password: this.createMofaForm.value.password,
      tags: this.createMofaForm.value.tags.map((d) => d.value)
    }
    this.superAgentApiService.updateMofa(this.updateLoginData.id,data).subscribe((e: any) => {
      if (e.status == 'failure') {
        let keys = Object.keys(e.msg);
        let msg = ''
        keys.forEach((key)=>{
          msg += "" + key + " - " +e.msg[key] + "\n";
        })
        if(msg == ''){
          "Mofa Credential couldn't be created "
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
          text: "Mofa Credential created successfully"
        });
        this.toggleCredentialForm();
        this.createMofaForm.reset();
        this.getMofaLogins();
      }
    })
  }
  getMofaLogins() {
    this.shimmer = true;
    this.superAgentApiService.getMofa().subscribe((d: any) => {
      this.logins = d.data;
      this.shimmer = false;
    })
  }

  toggleCredentialForm(){
    this.showCredentialForm = !this.showCredentialForm;
  }

  editLogin(login:any){
    this.createMofaForm.reset();
    this.updateLoginData = login;
    if(!this.showCredentialForm)
      this.toggleCredentialForm();
    this.showEditBtn = true;
    this.createMofaForm.patchValue({
      username:login.username,
      provider:login.provider.toUpperCase(),
      country:login.country,
    
    })
  }

  createMofaFormShow(){
    this.createMofaForm.reset();
    this.showEditBtn = false;
    if(!this.showCredentialForm)
      this.toggleCredentialForm();
  }

  closeForm(){
    this.showEditBtn = false;
    this.showCredentialForm = false;
    this.createMofaForm.reset();
  }
}
