import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTravellerDetailsComponent } from './main-traveller-details.component';

describe('MainTravellerDetailsComponent', () => {
  let component: MainTravellerDetailsComponent;
  let fixture: ComponentFixture<MainTravellerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainTravellerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTravellerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
