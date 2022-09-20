import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAgentHeaderSidePanelComponent } from './sub-agent-header-side-panel.component';

describe('SubAgentHeaderSidePanelComponent', () => {
  let component: SubAgentHeaderSidePanelComponent;
  let fixture: ComponentFixture<SubAgentHeaderSidePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubAgentHeaderSidePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAgentHeaderSidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
