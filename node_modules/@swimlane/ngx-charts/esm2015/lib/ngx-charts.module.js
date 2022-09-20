import { NgModule } from '@angular/core';
import { ChartCommonModule } from './common/chart-common.module';
import { AreaChartModule } from './area-chart/area-chart.module';
import { BarChartModule } from './bar-chart/bar-chart.module';
import { BoxChartModule } from './box-chart/box-chart.module';
import { BubbleChartModule } from './bubble-chart/bubble-chart.module';
import { HeatMapModule } from './heat-map/heat-map.module';
import { LineChartModule } from './line-chart/line-chart.module';
import { PolarChartModule } from './polar-chart/polar-chart.module';
import { NumberCardModule } from './number-card/number-card.module';
import { PieChartModule } from './pie-chart/pie-chart.module';
import { TreeMapModule } from './tree-map/tree-map.module';
import { GaugeModule } from './gauge/gauge.module';
import { ngxChartsPolyfills } from './polyfills';
export class NgxChartsModule {
    constructor() {
        ngxChartsPolyfills();
    }
}
NgxChartsModule.decorators = [
    { type: NgModule, args: [{
                exports: [
                    ChartCommonModule,
                    AreaChartModule,
                    BarChartModule,
                    BoxChartModule,
                    BubbleChartModule,
                    HeatMapModule,
                    LineChartModule,
                    PolarChartModule,
                    NumberCardModule,
                    PieChartModule,
                    TreeMapModule,
                    GaugeModule
                ]
            },] }
];
NgxChartsModule.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoYXJ0cy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvbmd4LWNoYXJ0cy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDakUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzlELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDM0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQWtCakQsTUFBTSxPQUFPLGVBQWU7SUFDMUI7UUFDRSxrQkFBa0IsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7OztZQW5CRixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLGlCQUFpQjtvQkFDakIsZUFBZTtvQkFDZixjQUFjO29CQUNkLGNBQWM7b0JBQ2QsaUJBQWlCO29CQUNqQixhQUFhO29CQUNiLGVBQWU7b0JBQ2YsZ0JBQWdCO29CQUNoQixnQkFBZ0I7b0JBQ2hCLGNBQWM7b0JBQ2QsYUFBYTtvQkFDYixXQUFXO2lCQUNaO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2hhcnRDb21tb25Nb2R1bGUgfSBmcm9tICcuL2NvbW1vbi9jaGFydC1jb21tb24ubW9kdWxlJztcbmltcG9ydCB7IEFyZWFDaGFydE1vZHVsZSB9IGZyb20gJy4vYXJlYS1jaGFydC9hcmVhLWNoYXJ0Lm1vZHVsZSc7XG5pbXBvcnQgeyBCYXJDaGFydE1vZHVsZSB9IGZyb20gJy4vYmFyLWNoYXJ0L2Jhci1jaGFydC5tb2R1bGUnO1xuaW1wb3J0IHsgQm94Q2hhcnRNb2R1bGUgfSBmcm9tICcuL2JveC1jaGFydC9ib3gtY2hhcnQubW9kdWxlJztcbmltcG9ydCB7IEJ1YmJsZUNoYXJ0TW9kdWxlIH0gZnJvbSAnLi9idWJibGUtY2hhcnQvYnViYmxlLWNoYXJ0Lm1vZHVsZSc7XG5pbXBvcnQgeyBIZWF0TWFwTW9kdWxlIH0gZnJvbSAnLi9oZWF0LW1hcC9oZWF0LW1hcC5tb2R1bGUnO1xuaW1wb3J0IHsgTGluZUNoYXJ0TW9kdWxlIH0gZnJvbSAnLi9saW5lLWNoYXJ0L2xpbmUtY2hhcnQubW9kdWxlJztcbmltcG9ydCB7IFBvbGFyQ2hhcnRNb2R1bGUgfSBmcm9tICcuL3BvbGFyLWNoYXJ0L3BvbGFyLWNoYXJ0Lm1vZHVsZSc7XG5pbXBvcnQgeyBOdW1iZXJDYXJkTW9kdWxlIH0gZnJvbSAnLi9udW1iZXItY2FyZC9udW1iZXItY2FyZC5tb2R1bGUnO1xuaW1wb3J0IHsgUGllQ2hhcnRNb2R1bGUgfSBmcm9tICcuL3BpZS1jaGFydC9waWUtY2hhcnQubW9kdWxlJztcbmltcG9ydCB7IFRyZWVNYXBNb2R1bGUgfSBmcm9tICcuL3RyZWUtbWFwL3RyZWUtbWFwLm1vZHVsZSc7XG5pbXBvcnQgeyBHYXVnZU1vZHVsZSB9IGZyb20gJy4vZ2F1Z2UvZ2F1Z2UubW9kdWxlJztcbmltcG9ydCB7IG5neENoYXJ0c1BvbHlmaWxscyB9IGZyb20gJy4vcG9seWZpbGxzJztcblxuQE5nTW9kdWxlKHtcbiAgZXhwb3J0czogW1xuICAgIENoYXJ0Q29tbW9uTW9kdWxlLFxuICAgIEFyZWFDaGFydE1vZHVsZSxcbiAgICBCYXJDaGFydE1vZHVsZSxcbiAgICBCb3hDaGFydE1vZHVsZSxcbiAgICBCdWJibGVDaGFydE1vZHVsZSxcbiAgICBIZWF0TWFwTW9kdWxlLFxuICAgIExpbmVDaGFydE1vZHVsZSxcbiAgICBQb2xhckNoYXJ0TW9kdWxlLFxuICAgIE51bWJlckNhcmRNb2R1bGUsXG4gICAgUGllQ2hhcnRNb2R1bGUsXG4gICAgVHJlZU1hcE1vZHVsZSxcbiAgICBHYXVnZU1vZHVsZVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE5neENoYXJ0c01vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIG5neENoYXJ0c1BvbHlmaWxscygpO1xuICB9XG59XG4iXX0=