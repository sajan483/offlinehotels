import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAllocationPopupComponent } from './room-allocation-popup.component';

describe('RoomAllocationPopupComponent', () => {
  let component: RoomAllocationPopupComponent;
  let fixture: ComponentFixture<RoomAllocationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomAllocationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomAllocationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
