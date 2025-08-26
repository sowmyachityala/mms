import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaccanShalatComponent } from './baccan-shalat.component';

describe('BaccanShalatComponent', () => {
  let component: BaccanShalatComponent;
  let fixture: ComponentFixture<BaccanShalatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaccanShalatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaccanShalatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
