import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentGatewayFeeComponent } from './payment-gateway-fee.component';

describe('PaymentGatewayFeeComponent', () => {
  let component: PaymentGatewayFeeComponent;
  let fixture: ComponentFixture<PaymentGatewayFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentGatewayFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentGatewayFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
