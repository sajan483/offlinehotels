import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaFrontPageComponent } from './visa-front-page.component';

describe('VisaFrontPageComponent', () => {
  let component: VisaFrontPageComponent;
  let fixture: ComponentFixture<VisaFrontPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisaFrontPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaFrontPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
