import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PengetahuanHajiComponent } from './pengetahuan-haji.component';

describe('PengetahuanHajiComponent', () => {
  let component: PengetahuanHajiComponent;
  let fixture: ComponentFixture<PengetahuanHajiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PengetahuanHajiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PengetahuanHajiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
