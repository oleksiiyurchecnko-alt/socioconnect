import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ButtonComponent);
  });

  it('should render default label', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('Click');
  });

  it('should render custom label', () => {
    fixture.componentRef.setInput('label', 'Submit');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('Submit');
  });

  it('should have button type by default', () => {
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.type).toBe('button');
  });
});
