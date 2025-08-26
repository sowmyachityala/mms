import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuranicVerseDialogComponent } from './update-quranic-verse-dialog.component';

describe('UpdateQuranicVerseDialogComponent', () => {
  let component: UpdateQuranicVerseDialogComponent;
  let fixture: ComponentFixture<UpdateQuranicVerseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateQuranicVerseDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateQuranicVerseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
