import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperUserComponent } from './super-user.component';
import { RouteGuard } from 'src/app/core/guards/route.guard';
import { Role } from 'src/app/core/model/role.enum';
import { HomeSuperUserComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { ConfiguracaoComponent } from './configuracao/configuracao.component';

const routes: Routes = [
  {
    path: 'super',
    data: {
      pageName: 'Menu',
      roles: [Role.ROLE_SUPER_USER]
    },
    component: SuperUserComponent,
    canActivate: [RouteGuard],
    children: [
      { path: '', component: HomeSuperUserComponent, data: {
          pageName: 'Página inicial'}},
      { path: 'gerenciarusuarios', component: UsuariosListComponent, data: {
          pageName: 'Gerenciar usuários' }},
      { path: 'configuracao', component: ConfiguracaoComponent, data: {
          pageName: 'Configuração' }},
      { path: 'cadastrousuario', component: CadastroUsuarioComponent, data: {
          pageName: 'Cadastro de usuário' }},
      { path: 'editarusuario/:id', component: EditarUsuarioComponent, data: {
          pageName: 'Edição de usuário'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperUserRoutingModule { }
