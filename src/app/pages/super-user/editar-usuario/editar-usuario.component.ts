import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/model/user.model';
import { Role } from 'src/app/core/model/role.enum';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/core/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit, OnDestroy {

  formGroupEditar: FormGroup;
  private subscriptions: Subscription[] = [];
  user: User;
  roleList: any[] = [
    {view: 'ADMINISTRADOR' , value: Role.ROLE_ADMIN},
    {view: 'SUPER USUÁRIO' , value: Role.ROLE_SUPER_USER},
  ];

  constructor(private titleService: Title,
              private activatedRoute: ActivatedRoute,
              private configService: ConfiguracaoService,
              private userService: UserService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.configService.recuperarTituloAplicacao()
                .subscribe(response => this.titleService.setTitle(response.body + ' - Editar usuário'))
    );

    this.user = new User();
    this.formGroupEditar = new FormGroup({
      id: new FormControl(this.user.id, Validators.required),
      login: new FormControl(this.user.login, Validators.required),
      nome: new FormControl(this.user.nome, Validators.required),
      senha: new FormControl(this.user.senha, Validators.required),
      roles: new FormControl(this.user.roles, Validators.required),
    });

    this.subscriptions.push(
      this.activatedRoute.paramMap.subscribe(params => {
        const id = params.get('id');
        this.subscriptions.push(
          this.userService.buscarPorId(id).subscribe(response => {
            this.user = response.body;
            this.formGroupEditar.get('id').setValue(this.user.id);
            this.formGroupEditar.get('login').setValue(this.user.login);
            this.formGroupEditar.get('nome').setValue(this.user.nome);
            this.formGroupEditar.get('senha').setValue(this.user.senha);
            this.formGroupEditar.get('roles').setValue(this.user.roles);
          }, error => {
            if (error.status === 404) {
              this.toastr.error(error.headers.errorMessage);
            }
            this.router.navigate(['/super/gerenciarusuarios']);
          })
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  atualizarUsuario(): void {
    this.user = this.formGroupEditar.value;
    this.subscriptions.push(
      this.userService.atualizar(this.user).subscribe(response => {
        this.toastr.success('Usuário atualizado com sucesso!');
        this.router.navigate(['/super/gerenciarusuarios']);
      }, err => {
        this.toastr.error('Não foi possível atualizar o usuário');
      })
    );
  }

}
