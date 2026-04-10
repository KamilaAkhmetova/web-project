import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Buffets } from './buffets';

describe('Buffets', () => {
  let component: Buffets;
  let fixture: ComponentFixture<Buffets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Buffets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Buffets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
