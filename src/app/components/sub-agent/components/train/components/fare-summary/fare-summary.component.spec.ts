import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FareSummaryComponent } from './fare-summary.component';

describe('FareSummaryComponent', () => {
  let component: FareSummaryComponent;
  let fixture: ComponentFixture<FareSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FareSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FareSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
