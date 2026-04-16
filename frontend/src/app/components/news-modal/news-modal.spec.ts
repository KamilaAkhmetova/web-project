import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsModal } from './news-modal';

describe('NewsModal', () => {
  let component: NewsModal;
  let fixture: ComponentFixture<NewsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsModal],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
