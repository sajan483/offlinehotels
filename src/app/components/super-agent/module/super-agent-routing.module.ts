import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTripComponent } from 'src/app/components/super-agent/create-trip/create-trip.component';
import { StepperComponent } from 'src/app/components/super-agent/create-trip/stepper/stepper.component';
import { BranchListComponent } from 'src/app/components/super-agent/branch-list/branch-list.component';
import { DashboardComponent } from 'src/app/components/super-agent/dashboard/dashboard.component';
import { AccountDetailsComponent } from 'src/app/components/super-agent/account-details/account-details.component';
import { BranchCreationComponent } from 'src/app/components/super-agent/branch-creation/branch-creation.component';
import { BranchUpdationComponent } from 'src/app/components/super-agent/branch-updation/branch-updation.component';
import { ProfileComponent } from 'src/app/components/super-agent/profile/profile.component';
import { StaffCreationComponent } from 'src/app/components/super-agent/staff-creation/staff-creation.component';
import { StaffListComponent } from 'src/app/components/super-agent/staff-list/staff-list.component';
import { ViewDetailsPackageComponent } from 'src/app/components/super-agent/view-details-package/view-details-package.component';
import { ViewEnquiryBookingsComponent } from 'src/app/components/super-agent/view-enquiry-bookings/view-enquiry-bookings.component';
import { ViewPackagesComponent } from 'src/app/components/super-agent/package_list/view-packages/view-packages.component';
import { PackageDetailsViewComponent } from 'src/app/components/super-agent/package_list/package-details-view/package-details-view.component';
import { PackageEditComponent } from 'src/app/components/super-agent/package_list/package-edit/package-edit.component';
import { BookingDetailsComponent } from 'src/app/components/super-agent/manage-bookings/booking-details/booking-details.component';
import { ManageBookingsComponent } from 'src/app/components/super-agent/manage-bookings/manage-bookings/manage-bookings.component';
import { ManuallyEditServicesComponent } from 'src/app/components/super-agent/package_list/package-edit/manually-edit-services/manually-edit-services.component';
import { VisaRequestsComponent } from 'src/app/components/super-agent/visa-requests/visa-requests/visa-requests.component';
import { SuperAgentMainPageComponent } from '../super-agent-main-page/super-agent-main-page.component';
import { VisaSubmissionComponent } from '../visa-submission/visa-submission.component';
import { MofaLoginsComponent } from '../mofa-logins/mofa-logins.component';

const myPath: Routes = [
  {
    path: '',component: SuperAgentMainPageComponent,
    children: [
      {
        path: "createTrip",component: CreateTripComponent
       },
       {
         path: "stepper",component: StepperComponent
       },
       {
         path: "package/:id/edit/services",component: ManuallyEditServicesComponent
       },
       {
         path: "account_details",component: AccountDetailsComponent
       },
       {
         path: "dashboard",component: DashboardComponent
       },
       {
         path: "branch_list",component: BranchListComponent
       },
       {
         path: "create_branch",component: BranchCreationComponent
       },
       {
         path: "update_branch/:id",component: BranchUpdationComponent
       },
       {
         path: "profile/:id",component: ProfileComponent
       },
       {
         path: "staff_creation",component: StaffCreationComponent
       },
       {
         path: "staff_list",component: StaffListComponent
       },
       {
         path: "view_package",component: ViewPackagesComponent
       },
       {
         path: "view_enquiry_bookings",component: ViewEnquiryBookingsComponent
       },
       {
         path: "package/details/:id",component: ViewDetailsPackageComponent
       },
       {
         path: "package/:id/visa-requests",component: VisaRequestsComponent
       },
       {
         path: "package/:id/view",component: PackageDetailsViewComponent
       },
       {
         path: "package/:id/edit",component: PackageEditComponent
       },
       {
        path: "visa-submission",component: VisaSubmissionComponent
       },
       {
         path: "package/:id/manage-bookings",component: ManageBookingsComponent
       },
       {
         path: "package/:id/bookings-details",component: BookingDetailsComponent
       },
       {
        path: "package/:id/visa-submissions",component: VisaSubmissionComponent
      },
       {
        path: "mofa-logins",component: MofaLoginsComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(myPath)],
  exports: [RouterModule]
})
export class SuperAgentRouteModule { }
