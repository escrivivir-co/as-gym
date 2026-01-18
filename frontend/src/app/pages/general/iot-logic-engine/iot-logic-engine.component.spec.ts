import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IotLogicEngineComponent } from './iot-logic-engine.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('IotLogicEngineComponent', () => {
  let component: IotLogicEngineComponent;
  let fixture: ComponentFixture<IotLogicEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IotLogicEngineComponent,RouterTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IotLogicEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
