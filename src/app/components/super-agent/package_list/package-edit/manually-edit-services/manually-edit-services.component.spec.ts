import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuallyEditServicesComponent } from './manually-edit-services.component';

describe('ManuallyEditServicesComponent', () => {
  let component: ManuallyEditServicesComponent;
  let fixture: ComponentFixture<ManuallyEditServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManuallyEditServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManuallyEditServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
