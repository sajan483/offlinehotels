import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { HttpModule } from '@angular/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HedderComponent } from './common/components/hedder/hedder.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
export function TranslatorFactory(httpClient: HttpClient) { return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json'); }
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CookieService } from 'ngx-cookie-service';
import { SliderComponent } from './common/components/slider/slider.component';
import { LandingApiService } from './components/landing/service/landing-api-services';
import { CommonApiService } from './Services/common-api-services';
import { BranchApiService } from 'src/app/Services/branch-api-service';
import {MatIconModule} from '@angular/material/icon';
import { SupportComponent } from './components/sub-agent/components/support/support.component';
import { SegmentModule } from 'ngx-segment-analytics';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
@NgModule({
  declarations: [
    AppComponent,
    HedderComponent,
    FooterComponent,
    SliderComponent,
    SupportComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    SegmentModule.forRoot({ apiKey: 'lSZTc5OVCLaCEyGT6Rtuw77HJb9gQYbp', debug: true, loadOnInitialization: true }),
    ToastrModule.forRoot({
      preventDuplicates: true, maxOpened: 1
    }),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslatorFactory,
        deps: [HttpClient]
      },
      isolate: false
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [DatePipe, CookieService, LandingApiService, CommonApiService, BranchApiService],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(public translateService: TranslateService) {
    translateService.addLangs(["en-US", "ar-AE", "bn-BN","fr-FR","hi-HI","id-ID","ml-ML","mr-MR","ms-MS","ta-TA","ur-UR"]);
    translateService.setDefaultLang('en-US'); /* Setting up the Translate Json to English - `en` */
  }
}

declare global {
  interface Window { analytics: any; }
}
