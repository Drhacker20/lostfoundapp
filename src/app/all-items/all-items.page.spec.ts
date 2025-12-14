import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllItemsPage } from './all-items.page';

describe('AllItemsPage', () => {
  let component: AllItemsPage;
  let fixture: ComponentFixture<AllItemsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
