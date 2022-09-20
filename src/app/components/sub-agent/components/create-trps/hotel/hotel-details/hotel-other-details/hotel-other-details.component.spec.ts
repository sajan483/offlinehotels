import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelOtherDetailsComponent } from './hotel-other-details.component';

describe('HotelOtherDetailsComponent', () => {
  let component: HotelOtherDetailsComponent;
  let fixture: ComponentFixture<HotelOtherDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelOtherDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelOtherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
