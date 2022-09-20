import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAgentMainPageComponent } from './super-agent-main-page.component';

describe('SuperAgentMainPageComponent', () => {
  let component: SuperAgentMainPageComponent;
  let fixture: ComponentFixture<SuperAgentMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAgentMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAgentMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
