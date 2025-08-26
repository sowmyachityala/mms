import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateEventComponent } from './create-update-event.component';

describe('CreateUpdateEventComponent', () => {
  let component: CreateUpdateEventComponent;
  let fixture: ComponentFixture<CreateUpdateEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdateEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpdateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
