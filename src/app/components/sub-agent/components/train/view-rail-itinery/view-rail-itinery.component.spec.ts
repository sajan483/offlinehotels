import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRailItineryComponent } from './view-rail-itinery.component';

describe('ViewRailItineryComponent', () => {
  let component: ViewRailItineryComponent;
  let fixture: ComponentFixture<ViewRailItineryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRailItineryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRailItineryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
