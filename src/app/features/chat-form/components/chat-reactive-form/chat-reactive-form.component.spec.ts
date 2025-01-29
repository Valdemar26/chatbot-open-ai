import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatReactiveFormComponent } from './chat-reactive-form.component';

describe('ChatReactiveFormComponent', () => {
  let component: ChatReactiveFormComponent;
  let fixture: ComponentFixture<ChatReactiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatReactiveFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatReactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
