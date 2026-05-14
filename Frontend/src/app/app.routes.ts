import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DiarioEmocionesComponent } from './pages/diario-emociones/diario-emociones.component';
import { CapsulasMotivacionComponent } from './pages/capsulas-motivacion/capsulas-motivacion.component';
import { MetasComponent } from './pages/micro-metas/micro-metas.component';
import { TermometroEstresComponent } from './pages/termometro-estres/termometro-estres.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'diario-emociones',
    component: DiarioEmocionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'capsulas-motivacion',
    component: CapsulasMotivacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'micro-metas',
    component: MetasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'termometro-estres',
    component: TermometroEstresComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
