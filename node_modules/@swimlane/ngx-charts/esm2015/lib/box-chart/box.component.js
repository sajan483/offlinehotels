import { Component, Input, Output, EventEmitter, HostListener, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { select } from 'd3-selection';
import { interpolate } from 'd3-interpolate';
import { easeSinInOut } from 'd3-ease';
import cloneDeep from 'clone-deep';
import { roundedRect } from '../common/shape.helper';
import { id } from '../utils/id';
import { BarOrientation } from '../common/types/bar-orientation.enum';
export class BoxComponent {
    constructor(element, cd) {
        this.cd = cd;
        this.roundEdges = true;
        this.gradient = false;
        this.offset = 0;
        this.isActive = false;
        this.animations = true;
        this.noBarWhenZero = true;
        this.select = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.BarOrientation = BarOrientation;
        this.initialized = false;
        this.hasGradient = false;
        this.hideBar = false;
        this.nativeElm = element.nativeElement;
    }
    ngOnChanges(changes) {
        if (!this.initialized) {
            this.loadAnimation();
            this.initialized = true;
        }
        else {
            this.update();
        }
    }
    update() {
        this.boxStrokeWidth = Math.max(this.strokeWidth, 1);
        this.whiskerStrokeWidth = Math.max(this.strokeWidth / 2, 1);
        this.medianLineWidth = 1.5 * this.strokeWidth;
        this.gradientId = 'grad' + id().toString();
        this.gradientFill = `url(#${this.gradientId})`;
        if (this.gradient) {
            this.gradientStops = this.getGradient();
            this.hasGradient = true;
        }
        else {
            this.hasGradient = false;
        }
        this.updateLineEl();
        this.updatePathEl();
        this.checkToHideBar();
        this.maskLineId = 'mask' + id().toString();
        this.maskLine = `url(#${this.maskLineId})`;
        if (this.cd) {
            this.cd.markForCheck();
        }
    }
    loadAnimation() {
        this.boxPath = this.oldPath = this.getStartingPath();
        this.oldLineCoordinates = this.getStartingLineCoordinates();
        setTimeout(this.update.bind(this), 100);
    }
    updatePathEl() {
        const nodeBar = select(this.nativeElm).selectAll('.bar');
        const path = this.getPath();
        if (this.animations) {
            nodeBar
                .attr('d', this.oldPath)
                .transition()
                .ease(easeSinInOut)
                .duration(500)
                .attrTween('d', this.pathTween(path, 4));
        }
        else {
            nodeBar.attr('d', path);
        }
        this.oldPath = path;
    }
    updateLineEl() {
        const lineEl = select(this.nativeElm).selectAll('.bar-line');
        const lineCoordinates = this.lineCoordinates;
        const oldLineCoordinates = this.oldLineCoordinates;
        if (this.animations) {
            lineEl
                .attr('x1', (_, index) => oldLineCoordinates[index].v1.x)
                .attr('y1', (_, index) => oldLineCoordinates[index].v1.y)
                .attr('x2', (_, index) => oldLineCoordinates[index].v2.x)
                .attr('y2', (_, index) => oldLineCoordinates[index].v2.y)
                .transition()
                .ease(easeSinInOut)
                .duration(500)
                .attr('x1', (_, index) => lineCoordinates[index].v1.x)
                .attr('y1', (_, index) => lineCoordinates[index].v1.y)
                .attr('x2', (_, index) => lineCoordinates[index].v2.x)
                .attr('y2', (_, index) => lineCoordinates[index].v2.y);
        }
        else {
            lineEl
                .attr('x1', (_, index) => lineCoordinates[index].v1.x)
                .attr('y1', (_, index) => lineCoordinates[index].v1.y)
                .attr('x2', (_, index) => lineCoordinates[index].v2.x)
                .attr('y2', (_, index) => lineCoordinates[index].v2.y);
        }
        this.oldLineCoordinates = [...lineCoordinates];
    }
    /**
     * See [D3 Selections](https://www.d3indepth.com/selections/)
     * @param d The joined data.
     * @param index The index of the element within the selection
     * @param node The node element (Line).
     */
    lineTween(attr, d, index, node) {
        const nodeLineEl = node[index];
        return nodeLineEl[attr].baseVal.value;
    }
    // TODO: Refactor into another .ts file if https://github.com/swimlane/ngx-charts/pull/1179 gets merged.
    pathTween(d1, precision) {
        return function () {
            // tslint:disable-next-line: no-this-assignment
            const path0 = this;
            const path1 = this.cloneNode();
            path1.setAttribute('d', d1);
            const n0 = path0 === null || path0 === void 0 ? void 0 : path0.getTotalLength();
            const n1 = path1 === null || path1 === void 0 ? void 0 : path1.getTotalLength();
            // Uniform sampling of distance based on specified precision.
            const distances = [0];
            let i = 0;
            const dt = precision / Math.max(n0, n1);
            while (i < 1) {
                distances.push(i);
                i += dt;
            }
            distances.push(1);
            // Compute point-interpolators at each distance.
            const points = distances.map((t) => {
                const p0 = path0.getPointAtLength(t * n0);
                const p1 = path1.getPointAtLength(t * n1);
                return interpolate([p0.x, p0.y], [p1.x, p1.y]);
            });
            // 't': T is the fraction of time (between 0 and 1) since the transition began.
            return (t) => {
                return t < 1 ? 'M' + points.map((p) => p(t)).join('L') : d1;
            };
        };
    }
    getStartingPath() {
        if (!this.animations) {
            return this.getPath();
        }
        const radius = this.roundEdges ? 1 : 0;
        const { x, y } = this.lineCoordinates[2].v1;
        return roundedRect(x - this.width, y - 1, this.width, 2, radius, this.edges);
    }
    getPath() {
        const radius = this.getRadius();
        let path = '';
        path = roundedRect(this.x, this.y, this.width, this.height, Math.min(this.height, radius), this.edges);
        return path;
    }
    getStartingLineCoordinates() {
        if (!this.animations) {
            return [...this.lineCoordinates];
        }
        const lineCoordinates = cloneDeep(this.lineCoordinates);
        lineCoordinates[1].v1.y = lineCoordinates[1].v2.y = lineCoordinates[3].v1.y = lineCoordinates[3].v2.y = lineCoordinates[0].v1.y = lineCoordinates[0].v2.y =
            lineCoordinates[2].v1.y;
        return lineCoordinates;
    }
    getRadius() {
        let radius = 0;
        if (this.roundEdges && this.height > 5 && this.width > 5) {
            radius = Math.floor(Math.min(5, this.height / 2, this.width / 2));
        }
        return radius;
    }
    getGradient() {
        return [
            {
                offset: 0,
                color: this.fill,
                opacity: this.getStartOpacity()
            },
            {
                offset: 100,
                color: this.fill,
                opacity: 1
            }
        ];
    }
    getStartOpacity() {
        if (this.roundEdges) {
            return 0.2;
        }
        else {
            return 0.5;
        }
    }
    get edges() {
        let edges = [false, false, false, false];
        if (this.roundEdges) {
            edges = [true, true, true, true];
        }
        return edges;
    }
    onMouseEnter() {
        this.activate.emit(this.data);
    }
    onMouseLeave() {
        this.deactivate.emit(this.data);
    }
    checkToHideBar() {
        this.hideBar = this.noBarWhenZero && this.height === 0;
    }
}
BoxComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-box]',
                template: `
    <svg:defs>
      <svg:g
        *ngIf="hasGradient"
        ngx-charts-svg-linear-gradient
        [orientation]="BarOrientation.Vertical"
        [name]="gradientId"
        [stops]="gradientStops"
      />
      <svg:mask [attr.id]="maskLineId">
        <svg:g>
          <rect height="100%" width="100%" fill="white" fill-opacity="1" />
          <path class="bar" [attr.d]="boxPath" fill="black" fill-opacity="1" />
        </svg:g>
      </svg:mask>
    </svg:defs>
    <svg:g>
      <svg:path
        class="bar"
        role="img"
        tabIndex="-1"
        [class.active]="isActive"
        [class.hidden]="hideBar"
        [attr.d]="boxPath"
        [attr.stroke]="strokeColor"
        [attr.stroke-width]="boxStrokeWidth"
        [attr.aria-label]="ariaLabel"
        [attr.fill]="hasGradient ? gradientFill : fill"
        (click)="select.emit(data)"
      />
      <svg:line
        *ngFor="let line of lineCoordinates; let i = index"
        class="bar-line"
        [class.hidden]="hideBar"
        [attr.x1]="line.v1.x"
        [attr.y1]="line.v1.y"
        [attr.x2]="line.v2.x"
        [attr.y2]="line.v2.y"
        [attr.stroke]="strokeColor"
        [attr.stroke-width]="i === 2 ? medianLineWidth : whiskerStrokeWidth"
        [attr.mask]="i ? undefined : maskLine"
        fill="none"
      />
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
BoxComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
BoxComponent.propDecorators = {
    strokeColor: [{ type: Input }],
    strokeWidth: [{ type: Input }],
    fill: [{ type: Input }],
    data: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    x: [{ type: Input }],
    y: [{ type: Input }],
    lineCoordinates: [{ type: Input }],
    roundEdges: [{ type: Input }],
    gradient: [{ type: Input }],
    gradientStops: [{ type: Input }],
    offset: [{ type: Input }],
    isActive: [{ type: Input }],
    animations: [{ type: Input }],
    ariaLabel: [{ type: Input }],
    noBarWhenZero: [{ type: Input }],
    select: [{ type: Output }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }],
    onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }],
    onMouseLeave: [{ type: HostListener, args: ['mouseleave',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9ib3gtY2hhcnQvYm94LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFlBQVksRUFDWixVQUFVLEVBR1YsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsTUFBTSxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBQ2hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRXZDLE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUVuQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUdqQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFzRHRFLE1BQU0sT0FBTyxZQUFZO0lBZ0R2QixZQUFZLE9BQW1CLEVBQVksRUFBcUI7UUFBckIsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUF0Q3ZELGVBQVUsR0FBWSxJQUFJLENBQUM7UUFDM0IsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUUxQixXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ25CLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIsZUFBVSxHQUFZLElBQUksQ0FBQztRQUUzQixrQkFBYSxHQUFZLElBQUksQ0FBQztRQUU3QixXQUFNLEdBQTRCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDckQsYUFBUSxHQUE0QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3ZELGVBQVUsR0FBNEIs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SSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTyxjQUFjO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztJQUN6RCxDQUFDOzs7WUEzVEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Q1Q7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7OztZQXJFQyxVQUFVO1lBSVYsaUJBQWlCOzs7MEJBbUVoQixLQUFLOzBCQUNMLEtBQUs7bUJBQ0wsS0FBSzttQkFDTCxLQUFLO29CQUNMLEtBQUs7cUJBQ0wsS0FBSztnQkFDTCxLQUFLO2dCQUNMLEtBQUs7OEJBQ0wsS0FBSzt5QkFDTCxLQUFLO3VCQUNMLEtBQUs7NEJBQ0wsS0FBSztxQkFDTCxLQUFLO3VCQUNMLEtBQUs7eUJBQ0wsS0FBSzt3QkFDTCxLQUFLOzRCQUNMLEtBQUs7cUJBRUwsTUFBTTt1QkFDTixNQUFNO3lCQUNOLE1BQU07MkJBeU9OLFlBQVksU0FBQyxZQUFZOzJCQUt6QixZQUFZLFNBQUMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIEVsZW1lbnRSZWYsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE9uQ2hhbmdlcyxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgc2VsZWN0LCBCYXNlVHlwZSB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBpbnRlcnBvbGF0ZSB9IGZyb20gJ2QzLWludGVycG9sYXRlJztcbmltcG9ydCB7IGVhc2VTaW5Jbk91dCB9IGZyb20gJ2QzLWVhc2UnO1xuXG5pbXBvcnQgY2xvbmVEZWVwIGZyb20gJ2Nsb25lLWRlZXAnO1xuXG5pbXBvcnQgeyByb3VuZGVkUmVjdCB9IGZyb20gJy4uL2NvbW1vbi9zaGFwZS5oZWxwZXInO1xuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi91dGlscy9pZCc7XG5pbXBvcnQgeyBJQm94TW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvY2hhcnQtZGF0YS5tb2RlbCc7XG5pbXBvcnQgeyBJVmVjdG9yMkQgfSBmcm9tICcuLi9tb2RlbHMvY29vcmRpbmF0ZXMubW9kZWwnO1xuaW1wb3J0IHsgQmFyT3JpZW50YXRpb24gfSBmcm9tICcuLi9jb21tb24vdHlwZXMvYmFyLW9yaWVudGF0aW9uLmVudW0nO1xuaW1wb3J0IHsgR3JhZGllbnQgfSBmcm9tICcuLi9jb21tb24vdHlwZXMvZ3JhZGllbnQuaW50ZXJmYWNlJztcblxudHlwZSBMaW5lQ29vcmRpbmF0ZXMgPSBbSVZlY3RvcjJELCBJVmVjdG9yMkQsIElWZWN0b3IyRCwgSVZlY3RvcjJEXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLWJveF0nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxzdmc6ZGVmcz5cbiAgICAgIDxzdmc6Z1xuICAgICAgICAqbmdJZj1cImhhc0dyYWRpZW50XCJcbiAgICAgICAgbmd4LWNoYXJ0cy1zdmctbGluZWFyLWdyYWRpZW50XG4gICAgICAgIFtvcmllbnRhdGlvbl09XCJCYXJPcmllbnRhdGlvbi5WZXJ0aWNhbFwiXG4gICAgICAgIFtuYW1lXT1cImdyYWRpZW50SWRcIlxuICAgICAgICBbc3RvcHNdPVwiZ3JhZGllbnRTdG9wc1wiXG4gICAgICAvPlxuICAgICAgPHN2ZzptYXNrIFthdHRyLmlkXT1cIm1hc2tMaW5lSWRcIj5cbiAgICAgICAgPHN2ZzpnPlxuICAgICAgICAgIDxyZWN0IGhlaWdodD1cIjEwMCVcIiB3aWR0aD1cIjEwMCVcIiBmaWxsPVwid2hpdGVcIiBmaWxsLW9wYWNpdHk9XCIxXCIgLz5cbiAgICAgICAgICA8cGF0aCBjbGFzcz1cImJhclwiIFthdHRyLmRdPVwiYm94UGF0aFwiIGZpbGw9XCJibGFja1wiIGZpbGwtb3BhY2l0eT1cIjFcIiAvPlxuICAgICAgICA8L3N2ZzpnPlxuICAgICAgPC9zdmc6bWFzaz5cbiAgICA8L3N2ZzpkZWZzPlxuICAgIDxzdmc6Zz5cbiAgICAgIDxzdmc6cGF0aFxuICAgICAgICBjbGFzcz1cImJhclwiXG4gICAgICAgIHJvbGU9XCJpbWdcIlxuICAgICAgICB0YWJJbmRleD1cIi0xXCJcbiAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJpc0FjdGl2ZVwiXG4gICAgICAgIFtjbGFzcy5oaWRkZW5dPVwiaGlkZUJhclwiXG4gICAgICAgIFthdHRyLmRdPVwiYm94UGF0aFwiXG4gICAgICAgIFthdHRyLnN0cm9rZV09XCJzdHJva2VDb2xvclwiXG4gICAgICAgIFthdHRyLnN0cm9rZS13aWR0aF09XCJib3hTdHJva2VXaWR0aFwiXG4gICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsXCJcbiAgICAgICAgW2F0dHIuZmlsbF09XCJoYXNHcmFkaWVudCA/IGdyYWRpZW50RmlsbCA6IGZpbGxcIlxuICAgICAgICAoY2xpY2spPVwic2VsZWN0LmVtaXQoZGF0YSlcIlxuICAgICAgLz5cbiAgICAgIDxzdmc6bGluZVxuICAgICAgICAqbmdGb3I9XCJsZXQgbGluZSBvZiBsaW5lQ29vcmRpbmF0ZXM7IGxldCBpID0gaW5kZXhcIlxuICAgICAgICBjbGFzcz1cImJhci1saW5lXCJcbiAgICAgICAgW2NsYXNzLmhpZGRlbl09XCJoaWRlQmFyXCJcbiAgICAgICAgW2F0dHIueDFdPVwibGluZS52MS54XCJcbiAgICAgICAgW2F0dHIueTFdPVwibGluZS52MS55XCJcbiAgICAgICAgW2F0dHIueDJdPVwibGluZS52Mi54XCJcbiAgICAgICAgW2F0dHIueTJdPVwibGluZS52Mi55XCJcbiAgICAgICAgW2F0dHIuc3Ryb2tlXT1cInN0cm9rZUNvbG9yXCJcbiAgICAgICAgW2F0dHIuc3Ryb2tlLXdpZHRoXT1cImkgPT09IDIgPyBtZWRpYW5MaW5lV2lkdGggOiB3aGlza2VyU3Ryb2tlV2lkdGhcIlxuICAgICAgICBbYXR0ci5tYXNrXT1cImkgPyB1bmRlZmluZWQgOiBtYXNrTGluZVwiXG4gICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgIC8+XG4gICAgPC9zdmc6Zz5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgQm94Q29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgc3Ryb2tlQ29sb3I6IHN0cmluZztcbiAgQElucHV0KCkgc3Ryb2tlV2lkdGg6IG51bWJlcjtcbiAgQElucHV0KCkgZmlsbDogc3RyaW5nO1xuICBASW5wdXQoKSBkYXRhOiBJQm94TW9kZWw7XG4gIEBJbnB1dCgpIHdpZHRoOiBudW1iZXI7XG4gIEBJbnB1dCgpIGhlaWdodDogbnVtYmVyO1xuICBASW5wdXQoKSB4OiBudW1iZXI7XG4gIEBJbnB1dCgpIHk6IG51bWJlcjtcbiAgQElucHV0KCkgbGluZUNvb3JkaW5hdGVzOiBMaW5lQ29vcmRpbmF0ZXM7XG4gIEBJbnB1dCgpIHJvdW5kRWRnZXM6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBncmFkaWVudDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBncmFkaWVudFN0b3BzOiBHcmFkaWVudFtdO1xuICBASW5wdXQoKSBvZmZzZXQ6IG51bWJlciA9IDA7XG4gIEBJbnB1dCgpIGlzQWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGFuaW1hdGlvbnM6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBhcmlhTGFiZWw6IHN0cmluZztcbiAgQElucHV0KCkgbm9CYXJXaGVuWmVybzogYm9vbGVhbiA9IHRydWU7XG5cbiAgQE91dHB1dCgpIHNlbGVjdDogRXZlbnRFbWl0dGVyPElCb3hNb2RlbD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPElCb3hNb2RlbD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkZWFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8SUJveE1vZGVsPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBCYXJPcmllbnRhdGlvbiA9IEJhck9yaWVudGF0aW9uO1xuXG4gIG5hdGl2ZUVsbTogYW55O1xuXG4gIC8vIFBhdGggcmVsYXRlZCBwcm9wZXJ0aWVzLlxuICBvbGRQYXRoOiBzdHJpbmc7XG4gIGJveFBhdGg6IHN0cmluZztcbiAgb2xkTGluZUNvb3JkaW5hdGVzOiBMaW5lQ29vcmRpbmF0ZXM7XG5cbiAgLy8gQ29sb3IgcmVsYXRlZCBwcm9wZXJ0aWVzLlxuICBncmFkaWVudElkOiBzdHJpbmc7XG4gIGdyYWRpZW50RmlsbDogc3RyaW5nO1xuICBpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuICBoYXNHcmFkaWVudDogYm9vbGVhbiA9IGZhbHNlO1xuICBoaWRlQmFyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIE1hc2sgUGF0aCB0byBjdXQgdGhlIGxpbmUgb24gdGhlIGJveCBwYXJ0LiAqL1xuICBtYXNrTGluZTogc3RyaW5nO1xuICAvKiogTWFzayBQYXRoIElkIHRvIGtlZXAgdHJhY2sgb2YgdGhlIG1hc2sgZWxlbWVudCAqL1xuICBtYXNrTGluZUlkOiBzdHJpbmc7XG5cbiAgYm94U3Ryb2tlV2lkdGg6IG51bWJlcjtcbiAgd2hpc2tlclN0cm9rZVdpZHRoOiBudW1iZXI7XG4gIG1lZGlhbkxpbmVXaWR0aDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICB0aGlzLm5hdGl2ZUVsbSA9IGVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMubG9hZEFuaW1hdGlvbigpO1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKCk6IHZvaWQge1xuICAgIHRoaXMuYm94U3Ryb2tlV2lkdGggPSBNYXRoLm1heCh0aGlzLnN0cm9rZVdpZHRoLCAxKTtcbiAgICB0aGlzLndoaXNrZXJTdHJva2VXaWR0aCA9IE1hdGgubWF4KHRoaXMuc3Ryb2tlV2lkdGggLyAyLCAxKTtcbiAgICB0aGlzLm1lZGlhbkxpbmVXaWR0aCA9IDEuNSAqIHRoaXMuc3Ryb2tlV2lkdGg7XG5cbiAgICB0aGlzLmdyYWRpZW50SWQgPSAnZ3JhZCcgKyBpZCgpLnRvU3RyaW5nKCk7XG4gICAgdGhpcy5ncmFkaWVudEZpbGwgPSBgdXJsKCMke3RoaXMuZ3JhZGllbnRJZH0pYDtcblxuICAgIGlmICh0aGlzLmdyYWRpZW50KSB7XG4gICAgICB0aGlzLmdyYWRpZW50U3RvcHMgPSB0aGlzLmdldEdyYWRpZW50KCk7XG4gICAgICB0aGlzLmhhc0dyYWRpZW50ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYXNHcmFkaWVudCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlTGluZUVsKCk7XG4gICAgdGhpcy51cGRhdGVQYXRoRWwoKTtcbiAgICB0aGlzLmNoZWNrVG9IaWRlQmFyKCk7XG4gICAgdGhpcy5tYXNrTGluZUlkID0gJ21hc2snICsgaWQoKS50b1N0cmluZygpO1xuICAgIHRoaXMubWFza0xpbmUgPSBgdXJsKCMke3RoaXMubWFza0xpbmVJZH0pYDtcblxuICAgIGlmICh0aGlzLmNkKSB7XG4gICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIGxvYWRBbmltYXRpb24oKTogdm9pZCB7XG4gICAgdGhpcy5ib3hQYXRoID0gdGhpcy5vbGRQYXRoID0gdGhpcy5nZXRTdGFydGluZ1BhdGgoKTtcbiAgICB0aGlzLm9sZExpbmVDb29yZGluYXRlcyA9IHRoaXMuZ2V0U3RhcnRpbmdMaW5lQ29vcmRpbmF0ZXMoKTtcbiAgICBzZXRUaW1lb3V0KHRoaXMudXBkYXRlLmJpbmQodGhpcyksIDEwMCk7XG4gIH1cblxuICB1cGRhdGVQYXRoRWwoKTogdm9pZCB7XG4gICAgY29uc3Qgbm9kZUJhciA9IHNlbGVjdCh0aGlzLm5hdGl2ZUVsbSkuc2VsZWN0QWxsKCcuYmFyJyk7XG4gICAgY29uc3QgcGF0aCA9IHRoaXMuZ2V0UGF0aCgpO1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbnMpIHtcbiAgICAgIG5vZGVCYXJcbiAgICAgICAgLmF0dHIoJ2QnLCB0aGlzLm9sZFBhdGgpXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmVhc2UoZWFzZVNpbkluT3V0KVxuICAgICAgICAuZHVyYXRpb24oNTAwKVxuICAgICAgICAuYXR0clR3ZWVuKCdkJywgdGhpcy5wYXRoVHdlZW4ocGF0aCwgNCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlQmFyLmF0dHIoJ2QnLCBwYXRoKTtcbiAgICB9XG4gICAgdGhpcy5vbGRQYXRoID0gcGF0aDtcbiAgfVxuXG4gIHVwZGF0ZUxpbmVFbCgpOiB2b2lkIHtcbiAgICBjb25zdCBsaW5lRWwgPSBzZWxlY3QodGhpcy5uYXRpdmVFbG0pLnNlbGVjdEFsbCgnLmJhci1saW5lJyk7XG4gICAgY29uc3QgbGluZUNvb3JkaW5hdGVzID0gdGhpcy5saW5lQ29vcmRpbmF0ZXM7XG4gICAgY29uc3Qgb2xkTGluZUNvb3JkaW5hdGVzID0gdGhpcy5vbGRMaW5lQ29vcmRpbmF0ZXM7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9ucykge1xuICAgICAgbGluZUVsXG4gICAgICAgIC5hdHRyKCd4MScsIChfLCBpbmRleCkgPT4gb2xkTGluZUNvb3JkaW5hdGVzW2luZGV4XS52MS54KVxuICAgICAgICAuYXR0cigneTEnLCAoXywgaW5kZXgpID0+IG9sZExpbmVDb29yZGluYXRlc1tpbmRleF0udjEueSlcbiAgICAgICAgLmF0dHIoJ3gyJywgKF8sIGluZGV4KSA9PiBvbGRMaW5lQ29vcmRpbmF0ZXNbaW5kZXhdLnYyLngpXG4gICAgICAgIC5hdHRyKCd5MicsIChfLCBpbmRleCkgPT4gb2xkTGluZUNvb3JkaW5hdGVzW2luZGV4XS52Mi55KVxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5lYXNlKGVhc2VTaW5Jbk91dClcbiAgICAgICAgLmR1cmF0aW9uKDUwMClcbiAgICAgICAgLmF0dHIoJ3gxJywgKF8sIGluZGV4KSA9PiBsaW5lQ29vcmRpbmF0ZXNbaW5kZXhdLnYxLngpXG4gICAgICAgIC5hdHRyKCd5MScsIChfLCBpbmRleCkgPT4gbGluZUNvb3JkaW5hdGVzW2luZGV4XS52MS55KVxuICAgICAgICAuYXR0cigneDInLCAoXywgaW5kZXgpID0+IGxpbmVDb29yZGluYXRlc1tpbmRleF0udjIueClcbiAgICAgICAgLmF0dHIoJ3kyJywgKF8sIGluZGV4KSA9PiBsaW5lQ29vcmRpbmF0ZXNbaW5kZXhdLnYyLnkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaW5lRWxcbiAgICAgICAgLmF0dHIoJ3gxJywgKF8sIGluZGV4KSA9PiBsaW5lQ29vcmRpbmF0ZXNbaW5kZXhdLnYxLngpXG4gICAgICAgIC5hdHRyKCd5MScsIChfLCBpbmRleCkgPT4gbGluZUNvb3JkaW5hdGVzW2luZGV4XS52MS55KVxuICAgICAgICAuYXR0cigneDInLCAoXywgaW5kZXgpID0+IGxpbmVDb29yZGluYXRlc1tpbmRleF0udjIueClcbiAgICAgICAgLmF0dHIoJ3kyJywgKF8sIGluZGV4KSA9PiBsaW5lQ29vcmRpbmF0ZXNbaW5kZXhdLnYyLnkpO1xuICAgIH1cbiAgICB0aGlzLm9sZExpbmVDb29yZGluYXRlcyA9IFsuLi5saW5lQ29vcmRpbmF0ZXNdO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBbRDMgU2VsZWN0aW9uc10oaHR0cHM6Ly93d3cuZDNpbmRlcHRoLmNvbS9zZWxlY3Rpb25zLylcbiAgICogQHBhcmFtIGQgVGhlIGpvaW5lZCBkYXRhLlxuICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBlbGVtZW50IHdpdGhpbiB0aGUgc2VsZWN0aW9uXG4gICAqIEBwYXJhbSBub2RlIFRoZSBub2RlIGVsZW1lbnQgKExpbmUpLlxuICAgKi9cbiAgbGluZVR3ZWVuKGF0dHI6IHN0cmluZywgZDogYW55LCBpbmRleDogbnVtYmVyLCBub2RlOiBCYXNlVHlwZVtdIHwgQXJyYXlMaWtlPEJhc2VUeXBlPikge1xuICAgIGNvbnN0IG5vZGVMaW5lRWwgPSBub2RlW2luZGV4XSBhcyBTVkdMaW5lRWxlbWVudDtcbiAgICByZXR1cm4gbm9kZUxpbmVFbFthdHRyXS5iYXNlVmFsLnZhbHVlO1xuICB9XG5cbiAgLy8gVE9ETzogUmVmYWN0b3IgaW50byBhbm90aGVyIC50cyBmaWxlIGlmIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2ltbGFuZS9uZ3gtY2hhcnRzL3B1bGwvMTE3OSBnZXRzIG1lcmdlZC5cbiAgcGF0aFR3ZWVuKGQxOiBzdHJpbmcsIHByZWNpc2lvbjogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdGhpcy1hc3NpZ25tZW50XG4gICAgICBjb25zdCBwYXRoMCA9IHRoaXM7XG4gICAgICBjb25zdCBwYXRoMSA9IHRoaXMuY2xvbmVOb2RlKCk7XG4gICAgICBwYXRoMS5zZXRBdHRyaWJ1dGUoJ2QnLCBkMSk7XG4gICAgICBjb25zdCBuMCA9IHBhdGgwPy5nZXRUb3RhbExlbmd0aCgpO1xuICAgICAgY29uc3QgbjEgPSBwYXRoMT8uZ2V0VG90YWxMZW5ndGgoKTtcbiAgICAgIC8vIFVuaWZvcm0gc2FtcGxpbmcgb2YgZGlzdGFuY2UgYmFzZWQgb24gc3BlY2lmaWVkIHByZWNpc2lvbi5cbiAgICAgIGNvbnN0IGRpc3RhbmNlcyA9IFswXTtcbiAgICAgIGxldCBpID0gMDtcbiAgICAgIGNvbnN0IGR0ID0gcHJlY2lzaW9uIC8gTWF0aC5tYXgobjAsIG4xKTtcbiAgICAgIHdoaWxlIChpIDwgMSkge1xuICAgICAgICBkaXN0YW5jZXMucHVzaChpKTtcbiAgICAgICAgaSArPSBkdDtcbiAgICAgIH1cbiAgICAgIGRpc3RhbmNlcy5wdXNoKDEpO1xuXG4gICAgICAvLyBDb21wdXRlIHBvaW50LWludGVycG9sYXRvcnMgYXQgZWFjaCBkaXN0YW5jZS5cbiAgICAgIGNvbnN0IHBvaW50cyA9IGRpc3RhbmNlcy5tYXAoKHQ6IG51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCBwMCA9IHBhdGgwLmdldFBvaW50QXRMZW5ndGgodCAqIG4wKTtcbiAgICAgICAgY29uc3QgcDEgPSBwYXRoMS5nZXRQb2ludEF0TGVuZ3RoKHQgKiBuMSk7XG4gICAgICAgIHJldHVybiBpbnRlcnBvbGF0ZShbcDAueCwgcDAueV0sIFtwMS54LCBwMS55XSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gJ3QnOiBUIGlzIHRoZSBmcmFjdGlvbiBvZiB0aW1lIChiZXR3ZWVuIDAgYW5kIDEpIHNpbmNlIHRoZSB0cmFuc2l0aW9uIGJlZ2FuLlxuICAgICAgcmV0dXJuICh0OiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHQgPCAxID8gJ00nICsgcG9pbnRzLm1hcCgocDogKHQ6IG51bWJlcikgPT4gYW55W10pID0+IHAodCkpLmpvaW4oJ0wnKSA6IGQxO1xuICAgICAgfTtcbiAgICB9O1xuICB9XG5cbiAgZ2V0U3RhcnRpbmdQYXRoKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLmFuaW1hdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFBhdGgoKTtcbiAgICB9XG5cbiAgICBjb25zdCByYWRpdXMgPSB0aGlzLnJvdW5kRWRnZXMgPyAxIDogMDtcbiAgICBjb25zdCB7IHgsIHkgfSA9IHRoaXMubGluZUNvb3JkaW5hdGVzWzJdLnYxO1xuXG4gICAgcmV0dXJuIHJvdW5kZWRSZWN0KHggLSB0aGlzLndpZHRoLCB5IC0gMSwgdGhpcy53aWR0aCwgMiwgcmFkaXVzLCB0aGlzLmVkZ2VzKTtcbiAgfVxuXG4gIGdldFBhdGgoKTogc3RyaW5nIHtcbiAgICBjb25zdCByYWRpdXMgPSB0aGlzLmdldFJhZGl1cygpO1xuICAgIGxldCBwYXRoID0gJyc7XG5cbiAgICBwYXRoID0gcm91bmRlZFJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCBNYXRoLm1pbih0aGlzLmhlaWdodCwgcmFkaXVzKSwgdGhpcy5lZGdlcyk7XG5cbiAgICByZXR1cm4gcGF0aDtcbiAgfVxuXG4gIGdldFN0YXJ0aW5nTGluZUNvb3JkaW5hdGVzKCk6IExpbmVDb29yZGluYXRlcyB7XG4gICAgaWYgKCF0aGlzLmFuaW1hdGlvbnMpIHtcbiAgICAgIHJldHVybiBbLi4udGhpcy5saW5lQ29vcmRpbmF0ZXNdO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmVDb29yZGluYXRlczogTGluZUNvb3JkaW5hdGVzID0gY2xvbmVEZWVwKHRoaXMubGluZUNvb3JkaW5hdGVzKTtcblxuICAgIGxpbmVDb29yZGluYXRlc1sxXS52MS55ID0gbGluZUNvb3JkaW5hdGVzWzFdLnYyLnkgPSBsaW5lQ29vcmRpbmF0ZXNbM10udjEueSA9IGxpbmVDb29yZGluYXRlc1szXS52Mi55ID0gbGluZUNvb3JkaW5hdGVzWzBdLnYxLnkgPSBsaW5lQ29vcmRpbmF0ZXNbMF0udjIueSA9XG4gICAgICBsaW5lQ29vcmRpbmF0ZXNbMl0udjEueTtcblxuICAgIHJldHVybiBsaW5lQ29vcmRpbmF0ZXM7XG4gIH1cblxuICBnZXRSYWRpdXMoKTogbnVtYmVyIHtcbiAgICBsZXQgcmFkaXVzID0gMDtcblxuICAgIGlmICh0aGlzLnJvdW5kRWRnZXMgJiYgdGhpcy5oZWlnaHQgPiA1ICYmIHRoaXMud2lkdGggPiA1KSB7XG4gICAgICByYWRpdXMgPSBNYXRoLmZsb29yKE1hdGgubWluKDUsIHRoaXMuaGVpZ2h0IC8gMiwgdGhpcy53aWR0aCAvIDIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFkaXVzO1xuICB9XG5cbiAgZ2V0R3JhZGllbnQoKTogR3JhZGllbnRbXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgb2Zmc2V0OiAwLFxuICAgICAgICBjb2xvcjogdGhpcy5maWxsLFxuICAgICAgICBvcGFjaXR5OiB0aGlzLmdldFN0YXJ0T3BhY2l0eSgpXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvZmZzZXQ6IDEwMCxcbiAgICAgICAgY29sb3I6IHRoaXMuZmlsbCxcbiAgICAgICAgb3BhY2l0eTogMVxuICAgICAgfVxuICAgIF07XG4gIH1cblxuICBnZXRTdGFydE9wYWNpdHkoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5yb3VuZEVkZ2VzKSB7XG4gICAgICByZXR1cm4gMC4yO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMC41O1xuICAgIH1cbiAgfVxuXG4gIGdldCBlZGdlcygpOiBib29sZWFuW10ge1xuICAgIGxldCBlZGdlczogW2Jvb2xlYW4sIGJvb2xlYW4sIGJvb2xlYW4sIGJvb2xlYW5dID0gW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXTtcbiAgICBpZiAodGhpcy5yb3VuZEVkZ2VzKSB7XG4gICAgICBlZGdlcyA9IFt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlXTtcbiAgICB9XG4gICAgcmV0dXJuIGVkZ2VzO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicpXG4gIG9uTW91c2VFbnRlcigpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2YXRlLmVtaXQodGhpcy5kYXRhKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKVxuICBvbk1vdXNlTGVhdmUoKTogdm9pZCB7XG4gICAgdGhpcy5kZWFjdGl2YXRlLmVtaXQodGhpcy5kYXRhKTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tUb0hpZGVCYXIoKTogdm9pZCB7XG4gICAgdGhpcy5oaWRlQmFyID0gdGhpcy5ub0JhcldoZW5aZXJvICYmIHRoaXMuaGVpZ2h0ID09PSAwO1xuICB9XG59XG4iXX0=