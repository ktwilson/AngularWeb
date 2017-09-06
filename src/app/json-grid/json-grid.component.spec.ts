import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonGridComponent } from './json-grid.component';

describe('JsonGridComponent', () => {
  let component: JsonGridComponent;
  let fixture: ComponentFixture<JsonGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
