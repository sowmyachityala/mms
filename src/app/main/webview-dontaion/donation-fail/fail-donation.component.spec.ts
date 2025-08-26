import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailDonationComponent } from './fail-donation.component';

describe('FailDonationComponent', () => {
  let component: FailDonationComponent;
  let fixture: ComponentFixture<FailDonationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailDonationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FailDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
