import { ListaComponent } from './components/lista/lista.component';
import { CreateComponent } from './components/create/create.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'create',
        component: CreateComponent
    },
    {
        path: '',
        component: ListaComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
