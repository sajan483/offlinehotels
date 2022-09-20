import { Component, OnInit,Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubAgentApiService } from 'src/app/Services/sub-agent-api-services';
import Swal from 'sweetalert2';
import { SubAgentGeneralHelper } from 'src/app/helpers/sub-agent/general-helper';
import { HedderComponent } from 'src/app/common/components/hedder/hedder.component';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-cancelation-popup',
  templateUrl: './cancelation-popup.component.html',
  styleUrls: ['./cancelation-popup.component.scss']
})
export class CancelationPopupComponent implements OnInit,OnDestroy{
  private destroy$ = new Subject();
  @Input() checkCancel: any;
  details: any;
  cancel: any;
  registerForm: FormGroup;
  submitted = false;
  btnactv: boolean;
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);
  @Input() currency: any;
  @Output() closePopup = new EventEmitter();

  constructor(private translate: TranslateService,private formBuilder: FormBuilder,private common: SubAgentApiService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      cancellation_text: ['', Validators.required]
    });
    this.details = this.checkCancel.details;
    this.cancel = this.checkCancel.cancel
  }

  get f() { return this.registerForm.controls; }

  confirmCancellation() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    this.btnactv = true;
    let body = {
      "cancellation_reason": (<HTMLTextAreaElement>document.getElementById("confirmCancellationInput")).value
    }
    this.common.getConfirmCancellation(this.details.id, body).pipe(takeUntil(this.destroy$)).subscribe((data:any) => {
      this.btnactv = true;
      window.location.reload();
      this.closecancelPopup();
    },(err)=>{
      this.showAlert(err.error.error)
    });
  }

  showAlert(err){
    Swal.fire({
      icon: 'error',
      text: err,
      confirmButtonText: this.translate.instant('OK')
    })
  }

  closecancelPopup(){
    this.closePopup.emit();
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }

}
