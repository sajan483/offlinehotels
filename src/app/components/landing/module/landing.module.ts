
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { HttpModule } from '@angular/http';
import { MatStepperModule, MatInputModule, MatButtonModule, MatSliderModule, MatCheckboxModule } from '@angular/material';
import { NgxSpinnerModule } from "ngx-spinner";
import { LandingRouteModule } from './landing-routing.module'
import { LoginComponent } from 'src/app/components/landing/components/login/login.component';
import { SignupComponent } from 'src/app/components/landing/components/signup/signup.component';
import { UploadDocsComponent } from 'src/app/components/landing/components/upload-docs/upload-docs.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { GeneralHelper } from '../../../helpers/General/general-helpers';
import { HelperService} from 'src/app/common/services/helper-service';
import { CommonApiService } from 'src/app/Services/common-api-services';
import { CookieService } from 'ngx-cookie-service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { loginHelper } from 'src/app/helpers/landing/login-helper';
import { OnlyNumberLandingDirective } from 'src/app/directives/phone-number/onlyNumber-landing.directive';
import { LandingApiService } from '../service/landing-api-services';
import {MatRadioModule} from '@angular/material/radio';
import { WhatsappLoginComponent } from '../components/whatsapp-login/whatsapp-login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
export function TranslatorFactory(httpClient: HttpClient) { return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json'); }


@NgModule({
  declarations: [
    LoginComponent, SignupComponent, UploadDocsComponent,OnlyNumberLandingDirective,
    WhatsappLoginComponent
  ],
  imports: [
    CommonModule,
    LandingRouteModule,
    HttpClientModule,
    HttpModule,
    NgxSpinnerModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSliderModule,
    MatCheckboxModule,
    Ng2TelInputModule,
    MatRadioModule,
    FlexLayoutModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslatorFactory,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  exports: [
    TranslateModule,
  ],
  providers: [GeneralHelper,HelperService,CommonApiService,CookieService,LandingApiService,loginHelper ]
})

export class LandingModule {
  constructor(public translateService: TranslateService) {
    translateService.addLangs(["en-US", "ar-AE", "bn-BN","fr-FR","hi-HI","id-ID","ml-ML","mr-MR","ms-MS","ta-TA","ur-UR"]);
    translateService.setDefaultLang('en-US'); /* Setting up the Translate Json to English - `en` */
  }
}