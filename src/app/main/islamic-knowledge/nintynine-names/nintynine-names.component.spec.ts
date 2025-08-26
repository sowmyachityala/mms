import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NintynineNamesComponent } from './nintynine-names.component';

describe('NintynineNamesComponent', () => {
  let component: NintynineNamesComponent;
  let fixture: ComponentFixture<NintynineNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NintynineNamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NintynineNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
