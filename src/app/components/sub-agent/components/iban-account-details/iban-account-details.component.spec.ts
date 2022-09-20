import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IBANAccountDetailsComponent } from './iban-account-details.component';

describe('IBANAccountDetailsComponent', () => {
  let component: IBANAccountDetailsComponent;
  let fixture: ComponentFixture<IBANAccountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IBANAccountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IBANAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
