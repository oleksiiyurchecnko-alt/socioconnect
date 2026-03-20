import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHomeComponent } from './dashboard-home.component';

describe('DashboardHomeComponent', () => {
  let fixture: ComponentFixture<DashboardHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHomeComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardHomeComponent);
    fixture.detectChanges();
  });

  it('should display Main in hero title', () => {
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Main',
    );
  });

  it('should display user name', () => {
    expect(fixture.nativeElement.textContent).toContain('Main User');
  });

  it('should display initial sum', () => {
    expect(fixture.nativeElement.textContent).toContain('Sum: 15');
  });

  it('should increment sum on button click', () => {
    const btn = fixture.nativeElement.querySelector('sc-button button');
    btn?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Sum: 16');
  });
});
