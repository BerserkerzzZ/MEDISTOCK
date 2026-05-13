import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin-guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/usuario/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'catalogo',
    loadChildren: () => import('./pages/producto/catalogo/catalogo.module').then( m => m.CatalogoPageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./pages/producto/carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'admin-productos',
    loadChildren: () => import('./pages/producto/admin-productos/admin-productos.module').then( m => m.AdminProductosPageModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/usuario/registro/registro.module').then( m => m.RegistroPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
