import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const myPath: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: "",
    loadChildren: () =>
      import("./components/landing/module/landing.module").then((m) => m.LandingModule),
  },
  {
    path: "subagent",
    loadChildren: () =>
      import("./components/sub-agent/module/sub-agent.module").then((m) => m.SubAgentModule),
  },
  {
    path: "superagent",
    loadChildren: () =>
      import("./components/super-agent/module/super-agent.module").then((m) => m.SuperAgentModule),
  },
  {
    path: "branch",
    loadChildren: () =>import("./components/branch/module/branch.module").then((m) => m.BranchModule),
  }      
];

@NgModule({
  imports: [RouterModule.forRoot(myPath)],
  exports: [RouterModule],
})

export class AppRoutingModule {}