import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RukunIslamComponent } from './rukun-islam.component';

describe('RukunIslamComponent', () => {
  let component: RukunIslamComponent;
  let fixture: ComponentFixture<RukunIslamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RukunIslamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RukunIslamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
