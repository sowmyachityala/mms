import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessDonationComponent } from './success-donation.component';

describe('SuccessDonationComponent', () => {
  let component: SuccessDonationComponent;
  let fixture: ComponentFixture<SuccessDonationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessDonationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
