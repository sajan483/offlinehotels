import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakkaHotelComponent } from './makka-hotel.component';

describe('MakkaHotelComponent', () => {
  let component: MakkaHotelComponent;
  let fixture: ComponentFixture<MakkaHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakkaHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakkaHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
