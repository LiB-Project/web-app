import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/model/user.model';
import { Role } from 'src/app/core/model/role.enum';
import { UserService } from 'src/app/core/services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent implements OnInit, OnDestroy {

  formGroupCadastro: FormGroup;
  private subscriptions: Subscription[] = [];
  user: User;
  roleList: any[] = [
    {view: 'ADMINISTRADOR' , value: Role.ROLE_ADMIN},
    {view: 'SUPER USUÁRIO' , value: Role.ROLE_SUPER_USER},
  ];

  constructor(private titleService: Title,
              private userService: UserService,
              private configService: ConfiguracaoService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.configService.recuperarTituloAplicacao()
              .subscribe(response => this.titleService.setTitle(response.body + ' - Cadastro de usuários'))
    );

    this.user = new User();
    this.formGroupCadastro = new FormGroup({
      login: new FormControl(this.user.login, Validators.required),
      nome: new FormControl(this.user.nome, Validators.required),
      senha: new FormControl(this.user.senha, Validators.required),
      roles: new FormControl([], Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  cadastrarUsuario(): void {
    this.user = this.formGroupCadastro.value;
    this.subscriptions.push(
      this.userService.cadastrar(this.user).subscribe(response => {
        this.toastr.success('Usuário cadastrado com sucesso!');
        this.router.navigate(['/super/gerenciarusuarios']);
      }, err => {
        this.toastr.error('Não foi possível cadastrar o usuário');
      })
    );
  }

}
