import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameworkButtonComponent } from './framework-button.component';

describe('FrameworkButtonComponent', () => {
  let component: FrameworkButtonComponent;
  let fixture: ComponentFixture<FrameworkButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrameworkButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrameworkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
