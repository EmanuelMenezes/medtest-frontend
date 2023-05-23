import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoComponent } from './dialogo.component';

describe('DialogoComponent', () => {
  let component: DialogoComponent;
  let fixture: ComponentFixture<DialogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogoComponent]
    });
    fixture = TestBed.createComponent(DialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
