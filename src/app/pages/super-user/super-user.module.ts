import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperUserRoutingModule } from './super-user-routing.module';
import { SuperUserComponent } from './super-user.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HomeSuperUserComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import {MatRippleModule} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import { ToastrModule } from 'ngx-toastr';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ConfiguracaoComponent } from './configuracao/configuracao.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    SuperUserComponent,
    NavigationComponent,
    HomeSuperUserComponent,
    UsuariosListComponent,
    CadastroUsuarioComponent,
    EditarUsuarioComponent,
    ConfiguracaoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatFormFieldModule,
    SuperUserRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatRippleModule,
    MatCardModule,
    MatGridListModule,
    MatPaginatorModule,
    MatSelectModule,
    ToastrModule,
    ComponentsModule,
    MaterialFileInputModule,
    AngularEditorModule
  ]
})
export class SuperUserModule { }
