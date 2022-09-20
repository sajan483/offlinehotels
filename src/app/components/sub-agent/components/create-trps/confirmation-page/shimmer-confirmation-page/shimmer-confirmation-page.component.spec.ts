import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShimmerConfirmationPageComponent } from './shimmer-confirmation-page.component';

describe('ShimmerConfirmationPageComponent', () => {
  let component: ShimmerConfirmationPageComponent;
  let fixture: ComponentFixture<ShimmerConfirmationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShimmerConfirmationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShimmerConfirmationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
