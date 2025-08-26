import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HajiUmrahComponent } from './haji-umrah.component';

describe('HajiUmrahComponent', () => {
  let component: HajiUmrahComponent;
  let fixture: ComponentFixture<HajiUmrahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HajiUmrahComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HajiUmrahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
