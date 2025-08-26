import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WuduGuideComponent } from './wudu-guide.component';

describe('WuduGuideComponent', () => {
  let component: WuduGuideComponent;
  let fixture: ComponentFixture<WuduGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WuduGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WuduGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
