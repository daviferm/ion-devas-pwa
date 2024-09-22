import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BarriosPage } from './barrios.page';

describe('BarriosPage', () => {
  let component: BarriosPage;
  let fixture: ComponentFixture<BarriosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarriosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BarriosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
