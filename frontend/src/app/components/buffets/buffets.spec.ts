import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuffetsComponent } from './buffets.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('BuffetsComponent', () => {
  let component: BuffetsComponent;
  let fixture: ComponentFixture<BuffetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuffetsComponent],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BuffetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});