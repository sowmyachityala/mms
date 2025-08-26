import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebDonationComponent } from './web-donation.component';

describe('WebDonationComponent', () => {
  let component: WebDonationComponent;
  let fixture: ComponentFixture<WebDonationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebDonationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
