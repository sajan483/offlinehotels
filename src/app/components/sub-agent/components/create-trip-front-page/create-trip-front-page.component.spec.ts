import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTripFrontPageComponent } from './create-trip-front-page.component';

describe('CreateTripFrontPageComponent', () => {
  let component: CreateTripFrontPageComponent;
  let fixture: ComponentFixture<CreateTripFrontPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTripFrontPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTripFrontPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
