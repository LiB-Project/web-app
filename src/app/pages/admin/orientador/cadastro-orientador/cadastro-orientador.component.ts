import { MatSnackBar, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { Orientador } from 'src/app/core/model/orientador.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { OrientadorService } from 'src/app/core/services/orientador.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cadastro-orientador',
  templateUrl: './cadastro-orientador.component.html',
  styleUrls: ['./cadastro-orientador.component.css']
})
export class CadastroOrientadorComponent implements OnInit,OnDestroy {
  formGroupCadastro: FormGroup;
  private subscription:Subscription;

  orientador: Orientador;

  constructor(private service:OrientadorService, private router: Router, private formBuilder: FormBuilder,
              private snackBar: MatSnackBar, public dialogRef: MatDialogRef<CadastroOrientadorComponent>) {
    this.formGroupCadastro = this.formBuilder.group({
      matricula: ['', Validators.required],
      nome: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.orientador = new Orientador();
  }

  cadastrar(){
    this.orientador.matricula = this.formGroupCadastro.value.matricula;
    this.orientador.nome = this.formGroupCadastro.value.nome;
    this.subscription = this.service.cadastrar(this.orientador)
                          .subscribe(
                            data=> {
                              this.dialogRef.close();
                            },
                            error=> {
                              let errorMessage = error.headers.get('errorMessage');
                              if(errorMessage != null){
                                this.dialogRef.close(errorMessage);
                              }else{
                                this.dialogRef.close('Não foi possível atualizar o orientador!');
                              }
                            }
                          );
  }

  ngOnDestroy(){
    if(this.subscription!=null){
      this.subscription.unsubscribe();
    }

  }

}
