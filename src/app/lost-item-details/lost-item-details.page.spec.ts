import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LostItemDetailsPage } from './lost-item-details.page';

describe('LostItemDetailsPage', () => {
  let component: LostItemDetailsPage;
  let fixture: ComponentFixture<LostItemDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LostItemDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
