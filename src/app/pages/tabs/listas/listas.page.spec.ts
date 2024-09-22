import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListasPage } from './listas.page';

describe('ListasPage', () => {
  let component: ListasPage;
  let fixture: ComponentFixture<ListasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
