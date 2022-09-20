import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/components/landing/components/login/login.component';
import { SignupComponent } from 'src/app/components/landing/components/signup/signup.component';
import { UploadDocsComponent } from 'src/app/components/landing/components/upload-docs/upload-docs.component';
import { WhatsappLoginComponent } from '../components/whatsapp-login/whatsapp-login.component';

const myPath: Routes = [
    {
        path: "login", component: LoginComponent,
    },
    {
      path: "signup", component: SignupComponent,
    },
    {
      path: "whatsapplogin", component: WhatsappLoginComponent,
    },
    {
      path: "upload/:id", component: UploadDocsComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(myPath)],
  exports: [RouterModule]
})
export class LandingRouteModule { }