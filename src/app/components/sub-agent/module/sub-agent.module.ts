import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingHistoryComponent } from 'src/app/components/sub-agent/components/booking-history/booking-history.component';
import { RoomAllocationPopupComponent } from 'src/app/components/sub-agent/components/create-trip-front-page/components/room-allocation-popup/room-allocation-popup.component';
import { CreateTripFrontPageComponent } from 'src/app/components/sub-agent/components/create-trip-front-page/create-trip-front-page.component';
import { PaymentStatusComponent } from 'src/app/components/sub-agent/components/itinerary-page/payment-status/payment-status.component';
import { ProfilePageComponent } from 'src/app/components/sub-agent/components/profile-page/profile-page.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatStepperModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule,MatIconModule, MatTabsModule, MatFormFieldModule, MatSelectModule, MatRadioModule, MatExpansionModule, MatCheckboxModule, MatProgressBarModule, MatDividerModule, MatMenuModule } from '@angular/material';
import { MatSliderModule } from '@angular/material/slider';
import { NgbRatingModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { SubAgentRouteModule } from './sub-agent-routing.module';
import { CreateTripComponent } from 'src/app/components/sub-agent/components/create-trip/create-trip.component';
import { LoaderComponent } from 'src/app/components/sub-agent/components/create-trip/components/loader/loader.component';
import { MakkaHotelComponent } from 'src/app/components/sub-agent/components/create-trip/components/makka-hotel/makka-hotel.component';
import { HotelDetailsPopupComponent } from 'src/app/components/sub-agent/components/create-trip/components/hotel-details-popup/hotel-details-popup.component';
import { TransportComponent } from 'src/app/components/sub-agent/components/create-trip/components/transport/transport.component';
import { HotelImagePopupComponent } from 'src/app/components/sub-agent/components/create-trip/components/hotel-image-popup/hotel-image-popup.component';
import { LoaderHotelPopupComponent } from 'src/app/components/sub-agent/components/create-trip/components/loader-hotel-popup/loader-hotel-popup.component';
import { PaymentHotelComponent } from 'src/app/components/sub-agent/components/create-trip/components/payment-hotel/payment-hotel.component';
import { RoomDetailsPopupComponent } from 'src/app/components/sub-agent/components/create-trip/components/room-details-popup/room-details-popup.component';
import { MobxAngularModule } from 'mobx-angular';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxGalleryModule } from 'ngx-gallery';
import { NgxSpinnerModule } from "ngx-spinner";
import { HelperService } from 'src/app/common/services/helper-service';
import { PaymentTransportComponent } from 'src/app/components/sub-agent/components/create-trip/components/payment-transport/payment-transport.component';
import { SubAgentApiService } from 'src/app/Services/sub-agent-api-services';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { SubAgentStateService } from '../../../Services/sub-agent-state.service';
import { PaginationComponent } from 'src/app/components/sub-agent/components/pagination/pagination.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CancelationPopupComponent } from 'src/app/components/sub-agent/components/itinerary-page/components/cancelation-popup/cancelation-popup.component';
import { IBANAccountDetailsComponent } from 'src/app/components/sub-agent/components/iban-account-details/iban-account-details.component';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TermsAndConditionComponent } from 'src/app/components/sub-agent/components/terms-and-condition/terms-and-condition.component';
import { IbanCreaterComponent } from 'src/app/components/sub-agent/components/iban-creater/iban-creater.component';
import { TermsConditionArabicComponent } from 'src/app/components/sub-agent/components/terms-condition-arabic/terms-condition-arabic.component';
import { SubpccUpdateComponent } from 'src/app/components/sub-agent/components/subpcc-update/subpcc-update.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { TagInputModule } from 'ngx-chips';
import { ReportComponent } from 'src/app/components/sub-agent/components/report/report.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { RoomAllocationPopupsComponent } from 'src/app/components/sub-agent/components/create-trip-front-page/components/room-allocation-popups/room-allocation-popups.component';
import { DateTimeToDateFormat } from 'src/app/helpers/date_time/date_pipe';
import { DateTimeToGDStime } from 'src/app/helpers/date_time/time_zone_pipe';
import { convertFrom24To12Format } from 'src/app/helpers/date_time/time_pipe';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SelectRoomGroupComponent } from 'src/app/components/sub-agent/components/create-trip/components/select-room-group/select-room-group.component';
import { BookingRequestsComponent } from 'src/app/components/sub-agent/components/create-trip-front-page/components/booking-requests/booking-requests.component';
import { OnlyNumberSubDirective } from 'src/app/directives/phone-number/onlyNumber-sub.directive';
import { RequestedHistoryComponent } from 'src/app/components/sub-agent/components/requested-history/requested-history.component';
import { MainTravellerDetailsComponent } from 'src/app/components/sub-agent/components/create-trip/components/main-traveller-details/main-traveller-details.component';
import { hotelsListComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-list/hotel-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HotelFilterWebComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-list/hotel-filter-web/hotel-filter-web.component';
import { HotelCardComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-list/hotel-card/hotel-card.component';
import { HotelCardShimmerComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-list/hotel-card-shimmer/hotel-card-shimmer.component';
import { HotelDetailsComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-details/hotel-details.component';
import { HotelSearchWindowComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-list/hotel-search-window/hotel-search-window.component';
import { RoomAllocationComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-list/hotel-search-window/room-allocation/room-allocation.component';
import { HotelSortComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-list/hotel-sort/hotel-sort.component';
import { RoomSelectionComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-details/room-selection/room-selection.component';
import { HotelHelper } from 'src/app/helpers/sub-agent/hotel-helpers';
import { LoaderHotelDetailsComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-details/loader-hotel-details/loader-hotel-details.component';
import { HotelImgeDetailsComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-details/hotel-imge-details/hotel-imge-details.component';
import { ImageFallbackDirective } from 'src/app/directives/image-fallback/image-fallback.directive';
import { ImageGalleryComponent } from 'src/app/components/sub-agent/components/common/image-gallery/image-gallery.component';
import { SubpccComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-details/subpcc/subpcc.component';
import { RoomDetailsComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-details/room-details/room-details.component';
import { HotelOtherDetailsComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-details/hotel-other-details/hotel-other-details.component';
import { ConfirmationPageComponent } from 'src/app/components/sub-agent/components/create-trps/confirmation-page/confirmation-page.component';
import { PaymentHotelCardComponent } from 'src/app/components/sub-agent/components/create-trps/confirmation-page/payment-hotel-card/payment-hotel-card.component';
import { PaymentTransportCardComponent } from 'src/app/components/sub-agent/components/create-trps/confirmation-page/payment-transport-card/payment-transport-card.component';
import { CancellationPolicyComponent } from 'src/app/components/sub-agent/components/create-trps/confirmation-page/cancellation-policy/cancellation-policy.component';
import { ShimmerConfirmationPageComponent } from 'src/app/components/sub-agent/components/create-trps/confirmation-page/shimmer-confirmation-page/shimmer-confirmation-page.component';
import { GroupLeaderDetailsComponent } from 'src/app/components/sub-agent/components/create-trps/confirmation-page/group-leader-details/group-leader-details.component';
import { BookingSummaryComponent } from 'src/app/components/sub-agent/components/create-trps/confirmation-page/booking-summary/booking-summary.component';
import { TermsAndConditionPopupComponent } from 'src/app/components/sub-agent/components/terms-and-condition-popup/terms-and-condition-popup.component';
import { BookingRequestPopupComponent } from 'src/app/components/sub-agent/components/create-trps/confirmation-page/booking-request-popup/booking-request-popup.component';
import { ConfirmationPopupComponent } from 'src/app/components/sub-agent/components/create-trps/confirmation-page/confirmation-popup/confirmation-popup.component';
import { PopupConfirmationComponent } from 'src/app/components/sub-agent/components/create-trps/confirmation-page/popup-confirmation/popup-confirmation.component';
// import { NgOtpInputModule } from  'ng-otp-input';
import { SubAgentComponent } from 'src/app/components/sub-agent/sub-agent/sub-agent.component';
import { ItineraryViewComponent } from 'src/app/components/sub-agent/components/itinerary-page/itinerary-view/itinerary-view.component';
import { KnowledgeBaseComponent } from 'src/app/components/sub-agent/components/knowledge-base/knowledge-base.component';
import { SubAgentHeaderComponent } from 'src/app/components/sub-agent/sub-agent-header/sub-agent-header.component';
import { ConvertCurrency } from 'src/app/components/sub-agent/directives/currencyConversionPipe';
import { DashboardSubAgentComponent } from 'src/app/components/sub-agent/components/dashboard-sub-agent/dashboard-sub-agent.component';
import { SubAgentInterceptor } from '../intercepter/sub-agent.interceptor';
import { ApiServiceSubAgent } from '../services/api-service-sub-agent';
import { CardLoaderComponent } from '../components/common/card-loader/card-loader.component';
import { FlightCardComponent } from '../components/flight_components/flight-list/flight-card/flight-card.component';
import { FlightListComponent } from '../components/flight_components/flight-list/flight-list.component';
import { FlightSearchComponent } from '../components/flight_components/flight-list/flight-search/flight-search.component';
import { FlightCardLoaderComponent } from '../components/flight_components/flight-list/flight-card-loader/flight-card-loader.component';
import { FlightServices } from '../components/flight_components/services/flight-api-services';
import { FlightHelper } from '../components/flight_components/helpers/helpers';
import { TransportListComponent } from '../components/create-trps/transport/transport-list/transport-list.component';
import { TransportSearchWindowComponent } from '../components/create-trps/transport/transport-list/transport-search-window/transport-search-window.component';
import { TrainSearchComponent } from '../components/train/components/train-search/train-search.component';
import { TrainComponent } from '../components/train/train/train.component';
import { FareSummaryComponent } from '../components/train/components/fare-summary/fare-summary.component';
import { SelectedTrainComponent } from '../components/train/components/selected-train/selected-train.component';
import { SuccessModalComponent } from '../components/train/components/success-modal/success-modal.component';
import { TrainSelectorComponent } from '../components/train/components/train-selector/train-selector.component';
import { RailTermsConditionsComponent } from '../components/train/components/rail-terms-conditions/rail-terms-conditions.component';
import { TrainListComponent } from '../components/train/components/train-list/train-list.component';
import { TrainSearchService } from '../services/data_service/trainsearch.service';
import { TrainService } from '../services/train.service';
import { WindowService } from '../services/window';
import { TrainItineryComponent } from '../components/train/train-itinery/train-itinery.component';
import { ViewRailItineryComponent } from '../components/train/view-rail-itinery/view-rail-itinery.component';
import { RailTravellerInfoComponent } from '../components/train/components/rail-traveller-info/rail-traveller-info.component';
import { RailTravellerInfoItemComponent } from '../components/train/components/rail-traveller-info-item/rail-traveller-info-item.component';
import { TransportCardComponent } from '../components/create-trps/transport/transport-list/transport-card/transport-card.component';
import { TransportSortComponent } from '../components/create-trps/transport/transport-list/transport-sort/transport-sort.component';
import { TransportFilterComponent } from '../components/create-trps/transport/transport-list/transport-filter/transport-filter.component';
import { FlightFilterComponent } from '../components/flight_components/flight-list/flight-filter/flight-filter.component';
import { FlightFilterHelper } from '../components/flight_components/helpers/flight_filter';
import { TransportCancellationPolicyComponent } from '../components/create-trps/transport/transport-list/transport-cancellation-policy/transport-cancellation-policy.component';
import { FlightDetailComponent } from '../components/flight_components/flight-detail/flight-detail.component';
import { FlightDetailCardComponent } from '../components/flight_components/flight-detail/flight-detail-card/flight-detail-card.component';
import { FlightDetailSummaryComponent } from '../components/flight_components/flight-detail/flight-detail-summary/flight-detail-summary.component';
import { RefundPolicyBarComponent } from '../components/common/refund-policy-bar/refund-policy-bar.component';
import { SalesOverviewComponent } from '../components/dashboard-sub-agent/sales-overview/sales-overview.component';
import { IncentiveComponent } from '../components/dashboard-sub-agent/incentive/incentive.component';
import { SendBookingRequestComponent } from '../components/booking-request/send-booking-request/send-booking-request.component';
import { RecievedBookingRequestComponent } from '../components/booking-request/recieved-booking-request/recieved-booking-request.component';
import { BookingRequestComponent } from '../components/booking-request/booking-request.component';
import { BookingListComponent } from '../components/booking-history/booking-list/booking-list.component';
import { FilterBookingListComponent } from '../components/booking-history/filter-booking-list/filter-booking-list.component';
import { SidePanelUpComponent } from '../components/common/side-panel-up/side-panel-up.component';
import { ItineraryShimmerComponent } from '../components/itinerary-page/components/itinerary-shimmer/itinerary-shimmer.component';
import { ItineraryHotelCardComponent } from '../components/itinerary-page/components/itinerary-hotel-card/itinerary-hotel-card.component';
import { ItineraryTransportCardComponent } from '../components/itinerary-page/components/itinerary-transport-card/itinerary-transport-card.component';
import { ItineraryPaxDetailsComponent } from '../components/itinerary-page/components/itinerary-pax-details/itinerary-pax-details.component';
import { ItineraryDownloadSectionComponent } from '../components/itinerary-page/components/itinerary-download-section/itinerary-download-section.component';
import { ItineraryFareSummaryComponent } from '../components/itinerary-page/components/itinerary-fare-summary/itinerary-fare-summary.component';
import { SubAgentHeaderSidePanelComponent } from '../sub-agent-header/sub-agent-header-side-panel/sub-agent-header-side-panel.component';
import { TrainShimmerComponent } from '../components/train/components/train-shimmer/train-shimmer.component';
import { SubUserListComponent } from '../components/sub-user-list/sub-user-list.component';
export function TranslatorFactory(httpClient: HttpClient) { return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json'); }
@NgModule({
  declarations: [
    BookingHistoryComponent,
    CreateTripFrontPageComponent,
    CreateTripComponent,
    PaymentStatusComponent,
    ProfilePageComponent,
    RoomAllocationPopupComponent,
    LoaderComponent,
    MakkaHotelComponent,
    HotelDetailsPopupComponent,
    TransportComponent,
    PaymentHotelComponent,
    RoomDetailsPopupComponent,
    LoaderHotelPopupComponent,
    HotelImagePopupComponent,
    PaymentTransportComponent,
    OnlyNumberSubDirective,
    PaginationComponent,
    ItineraryViewComponent,
    CancelationPopupComponent,
    IBANAccountDetailsComponent,
    RequestedHistoryComponent,
    TermsAndConditionComponent,
    IbanCreaterComponent,
    TermsConditionArabicComponent,
    SubpccUpdateComponent,
    KnowledgeBaseComponent,
    ReportComponent,
    RoomAllocationPopupsComponent,
    DateTimeToGDStime,
    convertFrom24To12Format,
    DateTimeToDateFormat,
    SelectRoomGroupComponent,
    BookingRequestsComponent,
    MainTravellerDetailsComponent,
    hotelsListComponent,
    HotelFilterWebComponent,
    HotelCardComponent,
    HotelCardShimmerComponent,
    HotelDetailsComponent,
    HotelSearchWindowComponent,
    RoomAllocationComponent,
    HotelSortComponent,
    RoomSelectionComponent,
    LoaderHotelDetailsComponent,
    HotelImgeDetailsComponent,
    ImageFallbackDirective,
    ImageGalleryComponent,
    SubpccComponent,
    RoomDetailsComponent,
    HotelOtherDetailsComponent,
    ConfirmationPageComponent,
    PaymentHotelCardComponent,
    PaymentTransportCardComponent,
    CancellationPolicyComponent,
    ShimmerConfirmationPageComponent,
    GroupLeaderDetailsComponent,
    BookingSummaryComponent,
    TermsAndConditionPopupComponent,
    BookingRequestPopupComponent,
    ConfirmationPopupComponent,
    PopupConfirmationComponent,
    SubAgentComponent,
    SubAgentHeaderComponent,
    ConvertCurrency,
    DateTimeToDateFormat,
    CardLoaderComponent,
    TransportListComponent,
    TransportSearchWindowComponent,
    DashboardSubAgentComponent,
    FlightListComponent,
    FlightSearchComponent,
    FlightCardLoaderComponent,
    FlightCardComponent,
    TrainComponent,
    TrainSearchComponent,
    TrainListComponent,
    FareSummaryComponent,
    SelectedTrainComponent,
    SuccessModalComponent,
    TrainSelectorComponent,
    RailTermsConditionsComponent,
    TrainItineryComponent,
    ViewRailItineryComponent,
    RailTravellerInfoComponent,
    RailTravellerInfoItemComponent,
    TransportFilterComponent,
    TransportSortComponent,
    TransportCardComponent,
    FlightFilterComponent,
    TransportCancellationPolicyComponent,
    FlightDetailComponent,
    FlightDetailCardComponent,
    FlightDetailSummaryComponent,
    RefundPolicyBarComponent,
    SalesOverviewComponent,
    IncentiveComponent,
    BookingRequestComponent,
    RecievedBookingRequestComponent,
    SendBookingRequestComponent,
    BookingListComponent,
    FilterBookingListComponent,
    SidePanelUpComponent,
    ItineraryShimmerComponent,
    ItineraryHotelCardComponent,
    ItineraryTransportCardComponent,
    ItineraryPaxDetailsComponent,
    ItineraryDownloadSectionComponent,
    ItineraryFareSummaryComponent,
    SubAgentHeaderSidePanelComponent,
    TrainShimmerComponent,
    SubUserListComponent,
  ],

  imports: [
    CommonModule,
    SubAgentRouteModule,
    MatSlideToggleModule,
    NgxGalleryModule,
    HttpClientModule,
    NgxSpinnerModule,
    // NgOtpInputModule,
    HttpModule,
    MobxAngularModule,
    MatStepperModule,
    MatFormFieldModule,
    TagInputModule,
    MatTabsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressBarModule,
    FilterPipeModule,
    MatExpansionModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgbRatingModule,
    NgbCarouselModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSliderModule,
    MatNativeDateModule,
    CarouselModule,
    Ng2TelInputModule,
    DateRangePickerModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslatorFactory,
        deps: [HttpClient]
      },
      isolate: false
    }),
    NgxChartsModule,
    NgxSliderModule,
    FlexLayoutModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    OwlDateTimeModule,
    MatAutocompleteModule,
    // PipeModule
  ],
  exports: [
    TranslateModule,
  ],
  providers: [SubAgentApiService, HelperService,SubAgentStateService,HotelHelper,ApiServiceSubAgent,TrainSearchService,TrainService,WindowService,DateTimeToDateFormat,FlightServices,FlightHelper,FlightFilterHelper,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SubAgentInterceptor,
      multi: true,
    }]

})

export class SubAgentModule {
  constructor(public translateService: TranslateService) {
    translateService.addLangs(["en-US", "ar-AE", "bn-BN","fr-FR","hi-HI","id-ID","ml-ML","mr-MR","ms-MS","ta-TA","ur-UR"]);
    translateService.setDefaultLang('en-US'); /* Setting up the Translate Json to English - `en` */
  }
}
