import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchRouteModule } from './branch-routing.module';
import { HomeComponent } from 'src/app/components/branch/pages/home/home.component';
import { PackageDetailsComponent } from 'src/app/components/branch/pages/home/package-details/package-details.component';
import { MatButtonModule, MatIconModule, MatInputModule, MatRadioModule, MatTabsModule ,MatCheckboxModule,
  MatSliderModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatTooltipModule,
  MatSelectModule,
  MatDividerModule,
  MatAutocompleteModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaxAndPaymentComponent } from 'src/app/components/branch/pages/home/pax-and-payment/pax-and-payment.component';
import { ConfirmationComponent } from 'src/app/components/branch/pages/home/confirmation/confirmation.component';
import { ProfileComponent } from 'src/app/components/branch/pages/profile/profile.component';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { PackageBookingsComponent } from 'src/app/components/branch/pages/package-bookings/package-bookings.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgbRatingModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { BiDatepickerModule } from 'bi-datepicker';
import { PaginationComponent } from 'src/app/components/branch/pagination/pagination.component';
import { PackageBookingsDetailsComponent } from 'src/app/components/branch/pages/package-bookings-details/package-bookings-details.component';
import { PassportDetailsComponent } from 'src/app/components/branch/pages/package-bookings-details/passport-details/passport-details.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PassportUploadComponent } from 'src/app/components/branch/pages/passport-upload/passport-upload.component';
import { VisaHeaderComponent } from 'src/app/components/branch/pages/passport-upload/visa-header/visa-header.component';
import { VisaDetailsComponent } from 'src/app/components/branch/pages/passport-upload/visa-details/visa-details.component';
import { PassengerDetailsComponent } from 'src/app/components/branch/pages/passport-upload/visa-details/passenger-details/passenger-details.component';
import { VisaFrontPageComponent } from 'src/app/components/branch/pages/passport-upload/visa-details/visa-front-page/visa-front-page.component';
import { VisaBackPageComponent } from 'src/app/components/branch/pages/passport-upload/visa-details/visa-back-page/visa-back-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImageEditorComponent } from 'src/app/components/branch/pages/passport-upload/image-editor/image-editor.component';
import { PhotoEditorComponent } from 'src/app/components/branch/pages/passport-upload/image-editor/photo-editor/photo-editor.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UploadDocumentComponent } from 'src/app/components/branch/pages/passport-upload/visa-details/upload-document/upload-document.component';
import { SideBarComponent } from 'src/app/components/branch/pages/passport-upload/previous-history/side-bar/side-bar.component';
import { PreviousHistoryComponent } from 'src/app/components/branch/pages/passport-upload/previous-history/previous-history/previous-history.component';
import { OnlyNumberBranchDirective } from 'src/app/directives/phone-number/onlyNumber-branch.directive';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BranchMainPageComponent } from '../branch-main-page/branch-main-page.component';
import { BranchHeaderComponent } from '../branch-header/branch-header.component';
import { PackageListComponent } from '../pages/package-list/package-list.component';
import { PackageFilterMenuComponent } from '../pages/package-filter-menu/package-filter-menu.component';
import { PackageFilterMobComponent } from '../pages/package-filter-mob/package-filter-mob.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    HomeComponent,
    PackageDetailsComponent,
    PaxAndPaymentComponent,
    ConfirmationComponent,
    ProfileComponent,
    PackageBookingsComponent,
    PaginationComponent,
    PackageBookingsDetailsComponent,
    PassportDetailsComponent,
    PassportUploadComponent,
    VisaHeaderComponent,
    VisaDetailsComponent,
    PassengerDetailsComponent,
    VisaFrontPageComponent,
    VisaBackPageComponent,
    ImageEditorComponent,
    PhotoEditorComponent,
    UploadDocumentComponent,
    SideBarComponent,
    PreviousHistoryComponent,
    OnlyNumberBranchDirective,
    BranchMainPageComponent,
    BranchHeaderComponent,
    PackageListComponent,
    PackageFilterMenuComponent,
    PackageFilterMobComponent,
  ],
  imports: [
    CommonModule,
    BranchRouteModule,
    MatDividerModule,
    MatIconModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSliderModule,
    MatAutocompleteModule,
    MatRadioModule,
    Ng2TelInputModule,
    CarouselModule,
    NgbRatingModule,
    BiDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FlexLayoutModule,
    MatSnackBarModule,
    MatDialogModule,
    PdfViewerModule,
    MatTooltipModule,
    MatSelectModule,
    NgxSpinnerModule,
    NgxMatSelectSearchModule
  ],
  entryComponents:[
    ImageEditorComponent
  ],
  exports: [
    BiDatepickerModule
  ]
})
export class BranchModule { }
