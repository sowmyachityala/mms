import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationChargesComponent } from './donation-charges.component';

describe('DonationChargesComponent', () => {
  let component: DonationChargesComponent;
  let fixture: ComponentFixture<DonationChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationChargesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
