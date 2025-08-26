import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosqueOnboardingComponent } from './mosque-onboarding.component';

describe('MosqueOnboardingComponent', () => {
  let component: MosqueOnboardingComponent;
  let fixture: ComponentFixture<MosqueOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MosqueOnboardingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MosqueOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
