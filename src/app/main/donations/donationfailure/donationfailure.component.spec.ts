import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationfailureComponent } from './donationfailure.component';

describe('DonationfailureComponent', () => {
  let component: DonationfailureComponent;
  let fixture: ComponentFixture<DonationfailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationfailureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationfailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
