import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IbanCreaterComponent } from './iban-creater.component';

describe('IbanCreaterComponent', () => {
  let component: IbanCreaterComponent;
  let fixture: ComponentFixture<IbanCreaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbanCreaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbanCreaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
