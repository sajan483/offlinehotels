import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BiDatepickerComponent } from './datepicker/bi-datepicker.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MonthComponent } from './month/month.component';
import { WeekComponent } from './week/week.component';

@NgModule({
  declarations: [BiDatepickerComponent, WeekComponent, MonthComponent, CalendarComponent],
  imports: [
    CommonModule,
    //BrowserAnimationsModule,
    FlexLayoutModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ],
  exports: [BiDatepickerComponent, CalendarComponent]
})
export class BiDatepickerModule { }