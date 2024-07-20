import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlephKadsComponent } from './dynamic-form.component';
import { SafePipe } from './safe.pipe';

describe('ExampleServicesComponent', () => {
  let component: AlephKadsComponent;
  let fixture: ComponentFixture<AlephKadsComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        AlephKadsComponent,
        SafePipe,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlephKadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
