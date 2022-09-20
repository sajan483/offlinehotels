import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsConditionArabicComponent } from './terms-condition-arabic.component';

describe('TermsConditionArabicComponent', () => {
  let component: TermsConditionArabicComponent;
  let fixture: ComponentFixture<TermsConditionArabicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsConditionArabicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsConditionArabicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
