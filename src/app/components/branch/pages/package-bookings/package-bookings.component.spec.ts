import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageBookingsComponent } from './package-bookings.component';

describe('PackageBookingsComponent', () => {
  let component: PackageBookingsComponent;
  let fixture: ComponentFixture<PackageBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
