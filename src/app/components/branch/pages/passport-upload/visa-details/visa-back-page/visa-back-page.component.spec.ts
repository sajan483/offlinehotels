import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaBackPageComponent } from './visa-back-page.component';

describe('VisaBackPageComponent', () => {
  let component: VisaBackPageComponent;
  let fixture: ComponentFixture<VisaBackPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisaBackPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaBackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
