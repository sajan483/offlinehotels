import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSubAgentComponent } from './dashboard-sub-agent.component';

describe('DashboardSubAgentComponent', () => {
  let component: DashboardSubAgentComponent;
  let fixture: ComponentFixture<DashboardSubAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSubAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSubAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
