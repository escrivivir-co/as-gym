import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnSindicModelVFComponent } from './asmvf.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AnSindicModelVFComponent', () => {
  let component: AnSindicModelVFComponent;
  let fixture: ComponentFixture<AnSindicModelVFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnSindicModelVFComponent,RouterTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnSindicModelVFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
