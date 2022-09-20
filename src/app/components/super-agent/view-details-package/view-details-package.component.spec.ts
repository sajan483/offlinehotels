import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailsPackageComponent } from './view-details-package.component';

describe('ViewDetailsPackageComponent', () => {
  let component: ViewDetailsPackageComponent;
  let fixture: ComponentFixture<ViewDetailsPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDetailsPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailsPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
