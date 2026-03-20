import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterModule.forRoot([])],
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
  });

  it('should display Admin title', () => {
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Admin'
    );
  });

  it('should display user name', () => {
    expect(fixture.nativeElement.textContent).toContain('Admin User');
  });

  it('should display initial sum', () => {
    expect(fixture.nativeElement.textContent).toContain('Sum: 5');
  });

  it('should increment sum on button click', () => {
    const btn = fixture.nativeElement.querySelector('sc-button button');
    btn?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Sum: 6');
  });
});
