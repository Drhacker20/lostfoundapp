import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatViewPage } from './chat-view.page';

describe('ChatViewPage', () => {
  let component: ChatViewPage;
  let fixture: ComponentFixture<ChatViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
