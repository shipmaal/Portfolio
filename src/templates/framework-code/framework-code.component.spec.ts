import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameworkCodeComponent } from './framework-code.component';

describe('FrameworkCodeComponent', () => {
  let component: FrameworkCodeComponent;
  let fixture: ComponentFixture<FrameworkCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrameworkCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrameworkCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
