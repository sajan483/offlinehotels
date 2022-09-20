import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDetailsViewComponent } from './package-details-view.component';

describe('PackageDetailsViewComponent', () => {
  let component: PackageDetailsViewComponent;
  let fixture: ComponentFixture<PackageDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
