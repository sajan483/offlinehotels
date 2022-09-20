import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelUpComponent } from './side-panel-up.component';

describe('SidePanelUpComponent', () => {
  let component: SidePanelUpComponent;
  let fixture: ComponentFixture<SidePanelUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidePanelUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePanelUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
