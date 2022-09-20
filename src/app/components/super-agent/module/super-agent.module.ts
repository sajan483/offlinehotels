import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SuperAgentRouteModule } from './super-agent-routing.module';
import { CreateTripComponent } from 'src/app/components/super-agent/create-trip/create-trip.component';
import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatDatepickerModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatNativeDateModule, MatProgressBarModule, MatStepperModule, MatTabsModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlightComponent } from 'src/app/components/super-agent/create-trip/stepper/flight/flight.component';
import { OtherInfoComponent } from 'src/app/components/super-agent/create-trip/stepper/other-info/other-info.component';
import { OtherServiceComponent } from 'src/app/components/super-agent/create-trip/stepper/other-service/other-service.component';
import { PaymentComponent } from 'src/app/components/super-agent/create-trip/stepper/payment/payment.component';
import { PreviewComponent } from 'src/app/components/super-agent/create-trip/stepper/preview/preview.component';
import { TransportComponent } from 'src/app/components/super-agent/create-trip/stepper/transport/transport.component';
import { FlightCardComponent } from 'src/app/components/super-agent/create-trip/stepper/flight/flight-card/flight-card.component';
import { FlightFooterComponent } from 'src/app/components/super-agent/create-trip/stepper/flight/flight-footer/flight-footer.component';
import { StepperComponent } from 'src/app/components/super-agent/create-trip/stepper/stepper.component';
import { GeneralHelper } from 'src/app/helpers/General/general-helpers';
import { CommonApiService } from 'src/app/Services/common-api-services';
import { HelperService } from 'src/app/common/services/helper-service';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { HotelComponent } from 'src/app/components/super-agent/create-trip/stepper/hotel/hotel.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {MatRadioModule} from '@angular/material/radio';
import { HotelDetailsPopupComponent } from 'src/app/components/super-agent/create-trip/stepper/hotel/hotel-details-popup/hotel-details-popup.component';
import { TagInputModule } from 'ngx-chips';
import { FlightDetailsComponent } from 'src/app/components/super-agent/create-trip/stepper/flight/flight-details/flight-details.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { RoomdetailsPopupComponent } from 'src/app/components/super-agent/create-trip/stepper/hotel/roomdetails-popup/roomdetails-popup.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HotelImagePopupComponent } from 'src/app/components/super-agent/create-trip/stepper/hotel/hotel-image-popup/hotel-image-popup.component';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { HotelLoaderComponent } from 'src/app/components/super-agent/create-trip/stepper/hotel/hotel-loader/hotel-loader.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BranchListComponent } from 'src/app/components/super-agent/branch-list/branch-list.component';
import { DashboardComponent } from 'src/app/components/super-agent/dashboard/dashboard.component';
import { AccountDetailsComponent } from 'src/app/components/super-agent/account-details/account-details.component';
import { BranchCreationComponent } from 'src/app/components/super-agent/branch-creation/branch-creation.component';
import { BranchUpdationComponent } from 'src/app/components/super-agent/branch-updation/branch-updation.component';
import { ProfileComponent } from 'src/app/components/super-agent/profile/profile.component';
import { StaffCreationComponent } from 'src/app/components/super-agent/staff-creation/staff-creation.component';
import { StaffListComponent } from 'src/app/components/super-agent/staff-list/staff-list.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { PaginationComponent } from 'src/app/components/super-agent/pagination/pagination.component';
import {MatSelectModule} from '@angular/material/select';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { ViewDetailsPackageComponent } from 'src/app/components/super-agent/view-details-package/view-details-package.component';
import { AddServicesComponent } from 'src/app/components/super-agent/create-trip/stepper/other-service/add-services/add-services.component';
import { ItineraryComponent } from 'src/app/components/super-agent/create-trip/stepper/itinerary/itinerary.component';
import { SuperAgentHelperService } from 'src/app/helpers/super-agent/super-agent-helper';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ViewEnquiryComponent } from 'src/app/components/super-agent/view-enquiry/view-enquiry.component';
import { ViewBookingsComponent } from 'src/app/components/super-agent/view-bookings/view-bookings.component';
import { ViewEnquiryBookingsComponent } from 'src/app/components/super-agent/view-enquiry-bookings/view-enquiry-bookings.component';
import { ViewPackagesComponent } from 'src/app/components/super-agent/package_list/view-packages/view-packages.component';
import { BiDatepickerModule } from 'bi-datepicker';
import { PackageDetailsViewComponent } from 'src/app/components/super-agent/package_list/package-details-view/package-details-view.component';
import { PackageEditComponent } from 'src/app/components/super-agent/package_list/package-edit/package-edit.component';
import { ManageBookingsComponent } from 'src/app/components/super-agent/manage-bookings/manage-bookings/manage-bookings.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import { BookingDetailsComponent } from 'src/app/components/super-agent/manage-bookings/booking-details/booking-details.component';
import { PassportDetailsFormComponent } from 'src/app/components/super-agent/manage-bookings/booking-details/passport-details-form/passport-details-form.component';
import { ManuallyEditServicesComponent } from 'src/app/components/super-agent/package_list/package-edit/manually-edit-services/manually-edit-services.component';
import {NgxPhotoEditorModule} from "ngx-photo-editor";
import { SearchingDataComponent } from 'src/app/components/super-agent/create-trip/searching-data/searching-data.component';
import { SuperAgentInterceptor } from 'src/app/core/super-agent/super-agent-interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OnlyNumberSuperDirective } from 'src/app/directives/phone-number/onlyNumber-super.directive';
import { VisaRequestsComponent } from 'src/app/components/super-agent/visa-requests/visa-requests/visa-requests.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SuperAgentHeaderComponent } from 'src/app/components/super-agent/super-agent-header/super-agent-header.component';
import { SuperAgentMainPageComponent } from 'src/app/components/super-agent/super-agent-main-page/super-agent-main-page.component';
import { VisaSubmissionComponent } from '../visa-submission/visa-submission.component';
import { AuCommonModuleModule } from 'src/app/au-common-module/au-common-module.module';
import { MofaLoginsComponent } from '../mofa-logins/mofa-logins.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
  

@NgModule({
  declarations: [
    CreateTripComponent,
    FlightComponent,
    OtherInfoComponent,
    OtherServiceComponent,
    PaymentComponent,
    PreviewComponent,
    TransportComponent,
    FlightCardComponent,
    FlightFooterComponent,
    StepperComponent,
    HotelComponent,
    HotelDetailsPopupComponent,
    ViewEnquiryBookingsComponent,
    FlightDetailsComponent,
    RoomdetailsPopupComponent,
    HotelImagePopupComponent,
    HotelLoaderComponent,
    BranchListComponent,
    DashboardComponent,
    AccountDetailsComponent,
    BranchCreationComponent,
    BranchUpdationComponent,
    ProfileComponent,
    StaffCreationComponent,
    StaffListComponent,
    OnlyNumberSuperDirective,
    PaginationComponent,
    ViewPackagesComponent,
    ViewDetailsPackageComponent,
    AddServicesComponent,
    ItineraryComponent,
    ViewEnquiryComponent,
    ViewBookingsComponent,
    PackageDetailsViewComponent,
    PackageEditComponent,
    ManageBookingsComponent,
    BookingDetailsComponent,
    PassportDetailsFormComponent,
    ManuallyEditServicesComponent,
    SearchingDataComponent,
    VisaRequestsComponent,
    SuperAgentHeaderComponent,
    VisaSubmissionComponent,
    SuperAgentMainPageComponent,
    MofaLoginsComponent
  ],
  imports: [
    CommonModule,
    TagInputModule,
    SuperAgentRouteModule,
    MatStepperModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatCardModule,
    BiDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatInputModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatRadioModule,
    MatTabsModule,
    NgbCarouselModule,
    CarouselModule,
    NgbRatingModule,
    AngularEditorModule,
    HttpClientModule,
    MatSelectModule,
    NgMultiSelectDropDownModule,
    DateRangePickerModule,
    Ng2TelInputModule,
    FilterPipeModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    NgxPhotoEditorModule,
    MatExpansionModule,
    NgxSpinnerModule,
    FlexLayoutModule,
    AuCommonModuleModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    DatePipe, GeneralHelper,CommonApiService,HelperService,SuperAgentApiService,SuperAgentHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SuperAgentInterceptor,
      multi: true,
    }
  ],
})

export class SuperAgentModule { }
