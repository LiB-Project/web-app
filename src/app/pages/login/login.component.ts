import { Component, OnInit, OnDestroy } from '@angular/core';
import { Credentials } from 'src/app/core/model/credentials.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/core/services/login.service';
import { UserStorageService } from 'src/app/core/services/user-storage.service';
import { Title } from '@angular/platform-browser';
import { UserAuthorization } from 'src/app/core/model/user-authorization';
import { Subscription } from 'rxjs';
import { Role } from '../../core/model/role.enum';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  formGroupLogin: FormGroup;

  constructor(private snackBar: MatSnackBar,
              private loginService: LoginService,
              private router: Router,
              private userStorage: UserStorageService,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private configService: ConfiguracaoService,
              private titleService: Title) {
      this.formGroupLogin = this.fb.group({
        login: ['', Validators.required],
        password: ['', Validators.required],
      });
  }

  ngOnInit() {
    this.subscriptions.push(
      this.configService.recuperarTituloAplicacao()
              .subscribe(response => this.titleService.setTitle(response.body + ' - Acesso ao sistema'))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  logar(): void {
    this.subscriptions.push(
      // get authorization
      this.loginService.login(this.formGroupLogin.value.login,
                              this.formGroupLogin.value.password).subscribe((response) => {
        const authorization = response.headers.get('Authorization');
        this.subscriptions.push(
          // get userdata to storage
          this.loginService.getDataUser(authorization).subscribe(responseUser => {
            const user = responseUser.body;
            const userToStorage = new UserAuthorization(user.nome, user.login, authorization, user.roles);
            this.userStorage.saveUserAuthorization(userToStorage);
            // redirecionando por padrão para o primeiro ROLE
            // futuramente o usuário poderia escolher
            if (userToStorage.roles[0] === Role.ROLE_ADMIN) {
              this.router.navigate(['/admin']);
            } else if (userToStorage.roles[0] === Role.ROLE_SUPER_USER) {
              this.router.navigate(['/super']);
            }
          }, err => {
            this.toastr.error('Ocorreu um problema', 'Não foi possível entrar no sistema');
          })
        );

      }, (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.toastr.error('Dados incorretos!', 'Não foi possível entrar no sistema');
        }
      })
    );
  }




}
