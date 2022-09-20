import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAgentHeaderComponent } from './super-agent-header.component';

describe('SuperAgentHeaderComponent', () => {
  let component: SuperAgentHeaderComponent;
  let fixture: ComponentFixture<SuperAgentHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAgentHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAgentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
