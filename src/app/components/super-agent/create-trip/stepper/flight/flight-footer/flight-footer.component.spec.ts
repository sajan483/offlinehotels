import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightFooterComponent } from './flight-footer.component';

describe('FlightFooterComponent', () => {
  let component: FlightFooterComponent;
  let fixture: ComponentFixture<FlightFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
