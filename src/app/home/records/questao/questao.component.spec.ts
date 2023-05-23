import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestaoComponent } from './questao.component';

describe('QuestaoComponent', () => {
  let component: QuestaoComponent;
  let fixture: ComponentFixture<QuestaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestaoComponent]
    });
    fixture = TestBed.createComponent(QuestaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
