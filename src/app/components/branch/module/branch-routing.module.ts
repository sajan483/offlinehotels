import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'src/app/components/branch/pages/home/home.component';
import { PackageDetailsComponent } from 'src/app/components/branch/pages/home/package-details/package-details.component';
import { PaxAndPaymentComponent } from 'src/app/components/branch/pages/home/pax-and-payment/pax-and-payment.component';
import { ConfirmationComponent } from 'src/app/components/branch/pages/home/confirmation/confirmation.component';
import { ProfileComponent } from 'src/app/components/branch/pages/profile/profile.component';
import { PackageBookingsComponent } from 'src/app/components/branch/pages/package-bookings/package-bookings.component';
import { PackageBookingsDetailsComponent } from 'src/app/components/branch/pages/package-bookings-details/package-bookings-details.component';
import { PassportUploadComponent } from 'src/app/components/branch/pages/passport-upload/passport-upload.component';
import { BranchMainPageComponent } from '../branch-main-page/branch-main-page.component';

const myPath: Routes = [
  {
    path: '',component: BranchMainPageComponent,
    children: [
    {
        path: "packages", component: HomeComponent,
    },
    {
      path: "bookings/:id/visa-request", component: PassportUploadComponent,
    },
    {
      path: "bookings", component: PackageBookingsComponent,
    },
    {
      path: "packages/:id/details", component: PackageDetailsComponent,
    },
    {
      path: "packages/:id/payment", component: PaxAndPaymentComponent,
    },
    {
      path: "packages/:id/success", component: ConfirmationComponent,
    },
    {
      path: "packages/bookings/:id/details", component: PackageBookingsDetailsComponent,
    },
    {
      path: "profile", component: ProfileComponent,
    },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(myPath)],
  exports: [RouterModule]
})
export class BranchRouteModule { }