import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTrasactionComponent } from './inventory-trasaction.component';

describe('InventoryTrasactionComponent', () => {
  let component: InventoryTrasactionComponent;
  let fixture: ComponentFixture<InventoryTrasactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryTrasactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryTrasactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
