import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassportUploadComponent } from './passport-upload.component';

describe('PassportUploadComponent', () => {
  let component: PassportUploadComponent;
  let fixture: ComponentFixture<PassportUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassportUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassportUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
