import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/model/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { PageEvent } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/core/model/role.enum';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  usuarios: User[];
  pageEvent: PageEvent;

  constructor(private userService: UserService,
              private titleService: Title,
              private configService: ConfiguracaoService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.configService.recuperarTituloAplicacao()
                .subscribe(response => this.titleService.setTitle(response.body + ' - Gerenciar usuários'))
    );

    this.pageEvent = new PageEvent();
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 15;
    this.carregarUsuarios();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  exibirRolesFormatado(roles: Role[]): string {
    return roles.map(role => {
      if (role === Role.ROLE_ADMIN) {
        return 'ADMINISTRADOR';
      } else if (role === Role.ROLE_SUPER_USER) {
        return 'SUPER USUÁRIO';
      }
    }).join(' - ');
  }

  setEvent(event: PageEvent): void {
    this.pageEvent = event;
    this.carregarUsuarios();
  }

  private carregarUsuarios(): void {
    this.subscriptions.push(
      this.userService.listar(this.pageEvent.pageIndex, this.pageEvent.pageSize)
        .subscribe(response => {
          this.pageEvent.length = Number(response.headers.get('X-Total-Count'));
          this.usuarios = response.body;
        })
    );
  }

  deletar(id: string): void {
    this.subscriptions.push(
      this.userService.deletar(id).subscribe(response => {
        this.toastr.success('Usuário removido com sucesso!');
        this.carregarUsuarios();
      }, err => {
        this.toastr.error('Não foi possível remover o usuário!');
      })
    );
  }
}
