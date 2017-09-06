import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveWeatherComponent } from './live-weather.component';

describe('LiveWeatherComponent', () => {
  let component: LiveWeatherComponent;
  let fixture: ComponentFixture<LiveWeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveWeatherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
