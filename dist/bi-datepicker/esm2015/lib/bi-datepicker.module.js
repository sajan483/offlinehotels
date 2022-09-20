/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class BiDatepickerModule {
}
BiDatepickerModule.decorators = [
    { type: NgModule, args: [{
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
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmktZGF0ZXBpY2tlci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9iaS1kYXRlcGlja2VyLyIsInNvdXJjZXMiOlsibGliL2JpLWRhdGVwaWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzdELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFjdEQsTUFBTSxPQUFPLGtCQUFrQjs7O1lBWjlCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixDQUFDO2dCQUN2RixPQUFPLEVBQUU7b0JBQ1AsWUFBWTtvQkFDWiwwQkFBMEI7b0JBQzFCLGdCQUFnQjtvQkFDaEIsYUFBYTtvQkFDYixjQUFjO29CQUNkLGdCQUFnQjtpQkFDakI7Z0JBQ0QsT0FBTyxFQUFFLENBQUMscUJBQXFCLEVBQUUsaUJBQWlCLENBQUM7YUFDcEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBGbGV4TGF5b3V0TW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2ZsZXgtbGF5b3V0XCI7XHJcbmltcG9ydCB7IE1hdEljb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJztcclxuaW1wb3J0IHsgTWF0SW5wdXRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dCc7XHJcbmltcG9ydCB7IE1hdFRvb2x0aXBNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90b29sdGlwJztcclxuaW1wb3J0IHsgQmlEYXRlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRlcGlja2VyL2JpLWRhdGVwaWNrZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ2FsZW5kYXJDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyL2NhbGVuZGFyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE1vbnRoQ29tcG9uZW50IH0gZnJvbSAnLi9tb250aC9tb250aC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBXZWVrQ29tcG9uZW50IH0gZnJvbSAnLi93ZWVrL3dlZWsuY29tcG9uZW50JztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgZGVjbGFyYXRpb25zOiBbQmlEYXRlcGlja2VyQ29tcG9uZW50LCBXZWVrQ29tcG9uZW50LCBNb250aENvbXBvbmVudCwgQ2FsZW5kYXJDb21wb25lbnRdLFxyXG4gIGltcG9ydHM6IFtcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIC8vQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsXHJcbiAgICBGbGV4TGF5b3V0TW9kdWxlLFxyXG4gICAgTWF0SWNvbk1vZHVsZSxcclxuICAgIE1hdElucHV0TW9kdWxlLFxyXG4gICAgTWF0VG9vbHRpcE1vZHVsZVxyXG4gIF0sXHJcbiAgZXhwb3J0czogW0JpRGF0ZXBpY2tlckNvbXBvbmVudCwgQ2FsZW5kYXJDb21wb25lbnRdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBCaURhdGVwaWNrZXJNb2R1bGUgeyB9Il19