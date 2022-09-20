import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCardLoaderComponent } from './flight-card-loader.component';

describe('FlightCardLoaderComponent', () => {
  let component: FlightCardLoaderComponent;
  let fixture: ComponentFixture<FlightCardLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightCardLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightCardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
