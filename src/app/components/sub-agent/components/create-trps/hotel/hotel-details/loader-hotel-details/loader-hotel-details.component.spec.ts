import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderHotelDetailsComponent } from './loader-hotel-details.component';

describe('LoaderHotelDetailsComponent', () => {
  let component: LoaderHotelDetailsComponent;
  let fixture: ComponentFixture<LoaderHotelDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaderHotelDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderHotelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
