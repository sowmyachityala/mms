import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddServiceCallComponent } from './add-servicecall.component';

describe('AddServiceCallComponent', () => {
    let component: AddServiceCallComponent;
    let fixture: ComponentFixture<AddServiceCallComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddServiceCallComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AddServiceCallComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
