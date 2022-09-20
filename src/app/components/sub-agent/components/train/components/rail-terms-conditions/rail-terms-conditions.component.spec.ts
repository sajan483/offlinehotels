import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RailTermsConditionsComponent } from './rail-terms-conditions.component';

describe('RailTermsConditionsComponent', () => {
  let component: RailTermsConditionsComponent;
  let fixture: ComponentFixture<RailTermsConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RailTermsConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RailTermsConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
