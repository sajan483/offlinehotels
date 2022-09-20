import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingHistoryComponent } from 'src/app/components/sub-agent/components/booking-history/booking-history.component';
import { CreateTripFrontPageComponent } from 'src/app/components/sub-agent/components/create-trip-front-page/create-trip-front-page.component';
import { PaymentStatusComponent } from 'src/app/components/sub-agent/components/itinerary-page/payment-status/payment-status.component';
import { ProfilePageComponent } from 'src/app/components/sub-agent/components/profile-page/profile-page.component';
import { CreateTripComponent } from 'src/app/components/sub-agent/components/create-trip/create-trip.component';
import { IBANAccountDetailsComponent } from 'src/app/components/sub-agent/components/iban-account-details/iban-account-details.component';
import { IbanCreaterComponent } from 'src/app/components/sub-agent/components/iban-creater/iban-creater.component';
import { SubpccUpdateComponent } from 'src/app/components/sub-agent/components/subpcc-update/subpcc-update.component';
import { ReportComponent } from 'src/app/components/sub-agent/components/report/report.component';
import { RequestedHistoryComponent } from 'src/app/components/sub-agent/components/requested-history/requested-history.component';
import { hotelsListComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-list/hotel-list.component';
import { HotelDetailsComponent } from 'src/app/components/sub-agent/components/create-trps/hotel/hotel-details/hotel-details.component';
import { ConfirmationPageComponent } from 'src/app/components/sub-agent/components/create-trps/confirmation-page/confirmation-page.component';
import { ItineraryViewComponent } from 'src/app/components/sub-agent/components/itinerary-page/itinerary-view/itinerary-view.component';
import { KnowledgeBaseComponent } from 'src/app/components/sub-agent/components/knowledge-base/knowledge-base.component';
import { SubAgentComponent } from 'src/app/components/sub-agent/sub-agent/sub-agent.component';
import { DashboardSubAgentComponent } from '../components/dashboard-sub-agent/dashboard-sub-agent.component';
import { FlightListComponent } from '../components/flight_components/flight-list/flight-list.component';
import { TransportListComponent } from '../components/create-trps/transport/transport-list/transport-list.component';
import { TrainComponent } from '../components/train/train/train.component';
import { TrainItineryComponent } from '../components/train/train-itinery/train-itinery.component';
import { ViewRailItineryComponent } from '../components/train/view-rail-itinery/view-rail-itinery.component';
import { FlightDetailComponent } from '../components/flight_components/flight-detail/flight-detail.component';
import { BookingRequestComponent } from '../components/booking-request/booking-request.component';
import { SubUserListComponent } from '../components/sub-user-list/sub-user-list.component';


const myPath: Routes = [
  {
    path: '',component: SubAgentComponent,
    children: [
      { path: 'transport-list/:lang/:currency', component: TransportListComponent },
      { path: "train_booking/:lang/:currency",component: TrainItineryComponent},
      { path: "train_booking/:id/:lang/:currency",component: ViewRailItineryComponent},
      { path: 'hotel-list/:lang/:currency', component: hotelsListComponent },
      { path: 'hotel-details/:lang/:currency', component: HotelDetailsComponent },
      { path: 'train/:lang/:currency', component: TrainComponent },
      { path: 'booking/:lang/:currency', component: ConfirmationPageComponent },
      { path: 'dashboard/:lang/:currency', component: DashboardSubAgentComponent },
      { path: "SubPccListing/:lang/:currency", component: SubpccUpdateComponent, },
      { path: "history/:lang/:currency", component: BookingHistoryComponent, },
      { path: "profilepage/:lang/:currency", component: ProfilePageComponent, },
      { path: "knowledge-base/:lang/:currency", component: KnowledgeBaseComponent, },
      { path: "requested-history/:lang/:currency", component: RequestedHistoryComponent, },
      { path: "payment/:id/:status/:lang/:currency", component: PaymentStatusComponent, },
      { path: "bookings/:id/details/:lang/:currency", component: PaymentStatusComponent, },
      { path: "bookings/:id/itinerary/:lang/:currency", component: ItineraryViewComponent, },
      { path: "booking-requests/:lang/:currency", component: BookingRequestComponent, },
      { path: "sub-users/:lang/:currency", component: SubUserListComponent, },

      { path: "home/:lang/:currency", component: CreateTripFrontPageComponent, },
      { path: "report", component: ReportComponent, },
      { path: "IBAN/details", component: IBANAccountDetailsComponent, },
      { path: "flight",component: FlightListComponent},
      { path: "flight/details",component: FlightDetailComponent},

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(myPath)],
  exports: [RouterModule]
})
export class SubAgentRouteModule { }
