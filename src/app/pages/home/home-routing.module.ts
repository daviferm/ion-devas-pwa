import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'barrios',
        loadChildren: () => import('../tabs/barrios/barrios.module').then( m => m.BarriosPageModule )
      },
      {
        path: 'search',
        loadChildren: () => import('../tabs/search/search.module').then( m => m.SearchPageModule )
      },
      {
        path: 'listas',
        loadChildren: () => import('../tabs/listas/listas.module').then( m => m.ListasPageModule )
      },
      {
        path: 'incidencias',
        loadChildren: () => import('../tabs/incidencias/incidencias.module').then( m => m.IncidenciasPageModule )
      },
      {
        path: 'soporte',
        loadChildren: () => import('../tabs/soporte/soporte.module').then( m => m.SoportePageModule )
      },
      {
        path: '',
        redirectTo: '/home/search',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: '/home/search',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
