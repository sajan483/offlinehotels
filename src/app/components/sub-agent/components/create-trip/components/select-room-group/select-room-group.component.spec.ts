import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRoomGroupComponent } from './select-room-group.component';

describe('SelectRoomGroupComponent', () => {
  let component: SelectRoomGroupComponent;
  let fixture: ComponentFixture<SelectRoomGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectRoomGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRoomGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
