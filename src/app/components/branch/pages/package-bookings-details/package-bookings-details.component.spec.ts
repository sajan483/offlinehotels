import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageBookingsDetailsComponent } from './package-bookings-details.component';

describe('PackageBookingsDetailsComponent', () => {
  let component: PackageBookingsDetailsComponent;
  let fixture: ComponentFixture<PackageBookingsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageBookingsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageBookingsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
