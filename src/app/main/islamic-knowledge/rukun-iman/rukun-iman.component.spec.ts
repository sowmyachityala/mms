import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RukunImanComponent } from './rukun-iman.component';

describe('RukunImanComponent', () => {
  let component: RukunImanComponent;
  let fixture: ComponentFixture<RukunImanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RukunImanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RukunImanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
