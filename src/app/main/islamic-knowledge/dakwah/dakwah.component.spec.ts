import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DakwahComponent } from './dakwah.component';

describe('DakwahComponent', () => {
  let component: DakwahComponent;
  let fixture: ComponentFixture<DakwahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DakwahComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DakwahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
