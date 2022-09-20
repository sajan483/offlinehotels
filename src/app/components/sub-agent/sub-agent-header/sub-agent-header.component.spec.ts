import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAgentHeaderComponent } from './sub-agent-header.component';

describe('SubAgentHeaderComponent', () => {
  let component: SubAgentHeaderComponent;
  let fixture: ComponentFixture<SubAgentHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubAgentHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAgentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
