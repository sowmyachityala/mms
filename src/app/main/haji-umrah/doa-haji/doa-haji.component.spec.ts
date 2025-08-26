import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoaHajiComponent } from './doa-haji.component';

describe('DoaHajiComponent', () => {
  let component: DoaHajiComponent;
  let fixture: ComponentFixture<DoaHajiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoaHajiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoaHajiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
