import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InetAppComponent } from './inet-app.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('InetAppComponent', () => {
  let component: InetAppComponent;
  let fixture: ComponentFixture<InetAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InetAppComponent,RouterTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InetAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
