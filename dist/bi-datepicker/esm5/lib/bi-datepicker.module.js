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
var BiDatepickerModule = /** @class */ (function () {
    function BiDatepickerModule() {
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
    return BiDatepickerModule;
}());
export { BiDatepickerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmktZGF0ZXBpY2tlci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9iaS1kYXRlcGlja2VyLyIsInNvdXJjZXMiOlsibGliL2JpLWRhdGVwaWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzdELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFdEQ7SUFBQTtJQVlrQyxDQUFDOztnQkFabEMsUUFBUSxTQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLHFCQUFxQixFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLENBQUM7b0JBQ3ZGLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLDBCQUEwQjt3QkFDMUIsZ0JBQWdCO3dCQUNoQixhQUFhO3dCQUNiLGNBQWM7d0JBQ2QsZ0JBQWdCO3FCQUNqQjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxpQkFBaUIsQ0FBQztpQkFDcEQ7O0lBQ2lDLHlCQUFDO0NBQUEsQUFabkMsSUFZbUM7U0FBdEIsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgRmxleExheW91dE1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9mbGV4LWxheW91dFwiO1xyXG5pbXBvcnQgeyBNYXRJY29uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbic7XHJcbmltcG9ydCB7IE1hdElucHV0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaW5wdXQnO1xyXG5pbXBvcnQgeyBNYXRUb29sdGlwTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdG9vbHRpcCc7XHJcbmltcG9ydCB7IEJpRGF0ZXBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4vZGF0ZXBpY2tlci9iaS1kYXRlcGlja2VyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENhbGVuZGFyQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci9jYWxlbmRhci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNb250aENvbXBvbmVudCB9IGZyb20gJy4vbW9udGgvbW9udGguY29tcG9uZW50JztcclxuaW1wb3J0IHsgV2Vla0NvbXBvbmVudCB9IGZyb20gJy4vd2Vlay93ZWVrLmNvbXBvbmVudCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW0JpRGF0ZXBpY2tlckNvbXBvbmVudCwgV2Vla0NvbXBvbmVudCwgTW9udGhDb21wb25lbnQsIENhbGVuZGFyQ29tcG9uZW50XSxcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICAvL0Jyb3dzZXJBbmltYXRpb25zTW9kdWxlLFxyXG4gICAgRmxleExheW91dE1vZHVsZSxcclxuICAgIE1hdEljb25Nb2R1bGUsXHJcbiAgICBNYXRJbnB1dE1vZHVsZSxcclxuICAgIE1hdFRvb2x0aXBNb2R1bGVcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtCaURhdGVwaWNrZXJDb21wb25lbnQsIENhbGVuZGFyQ29tcG9uZW50XVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQmlEYXRlcGlja2VyTW9kdWxlIHsgfSJdfQ==