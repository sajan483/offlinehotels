import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelImgeDetailsComponent } from './hotel-imge-details.component';

describe('HotelImgeDetailsComponent', () => {
  let component: HotelImgeDetailsComponent;
  let fixture: ComponentFixture<HotelImgeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelImgeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelImgeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
