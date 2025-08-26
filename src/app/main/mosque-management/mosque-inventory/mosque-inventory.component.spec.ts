import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosqueInventoryComponent } from './mosque-inventory.component';

describe('MosqueInventoryComponent', () => {
  let component: MosqueInventoryComponent;
  let fixture: ComponentFixture<MosqueInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MosqueInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MosqueInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
