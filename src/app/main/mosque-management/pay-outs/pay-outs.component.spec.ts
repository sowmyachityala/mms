import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayOutsComponent } from './pay-outs.component';

describe('PayOutsComponent', () => {
  let component: PayOutsComponent;
  let fixture: ComponentFixture<PayOutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayOutsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayOutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
