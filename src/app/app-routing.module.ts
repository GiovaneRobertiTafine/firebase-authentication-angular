import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuardService } from './auth/auth-guard.service';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/main/people' },
    {
        path: 'main', loadChildren: () =>
            import('./main/main.module').then(
                (m) => m.MainModule
            ),
        canActivate: [AuthGuardService]
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
