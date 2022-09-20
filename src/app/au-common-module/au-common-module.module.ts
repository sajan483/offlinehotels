import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountrySelectorComponent } from './country-selector/country-selector.component';
import { UsernameSelectorComponent } from './username-selector/username-selector.component';



@NgModule({
  declarations: [CountrySelectorComponent, UsernameSelectorComponent],
  imports: [
    CommonModule
  ],
  exports:[
    CountrySelectorComponent,
    UsernameSelectorComponent
  ]
})
export class AuCommonModuleModule { }
