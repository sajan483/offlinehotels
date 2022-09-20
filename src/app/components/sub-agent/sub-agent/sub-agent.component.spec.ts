import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAgentComponent } from './sub-agent.component';

describe('SubAgentComponent', () => {
  let component: SubAgentComponent;
  let fixture: ComponentFixture<SubAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
