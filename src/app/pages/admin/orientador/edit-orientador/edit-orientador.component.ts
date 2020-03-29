import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Orientador } from 'src/app/core/model/orientador.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OrientadorService } from 'src/app/core/services/orientador.service';

@Component({
  selector: 'app-edit-orientador',
  templateUrl: './edit-orientador.component.html',
  styleUrls: ['./edit-orientador.component.css']
})
export class EditOrientadorComponent implements OnInit,OnDestroy {

  formGroupEdit: FormGroup;
  matricula: string;
  orientador: Orientador;
  private subscription:Subscription;

  constructor(private service: OrientadorService,
              private fb:FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<EditOrientadorComponent>) { }

  ngOnInit() {
    this.orientador = new Orientador();
    //retrieve data passed in open dialog
    this.formGroupEdit = this.fb.group({
      id:['',Validators.required],
      matricula: ['',Validators.required],
      nome: ['',Validators.required],
    });
    this.orientador = this.data.orientador;
    this.formGroupEdit.setValue(this.orientador);
  }
  ngOnDestroy(){
    if(this.subscription!=null){
        this.subscription.unsubscribe();
    }
  }

  atualizar(){
    this.orientador.matricula = this.formGroupEdit.value.matricula;
    this.orientador.nome = this.formGroupEdit.value.nome;
    this.subscription = this.service.atualizar(this.orientador).subscribe(
      data=>{
        this.dialogRef.close(data.headers.get('successMessage'));
      },
      error=>{
        let errorMessage = error.headers.get('errorMessage');
        if(errorMessage != null){
          this.dialogRef.close(errorMessage);
        }else{
          this.dialogRef.close('Não foi possível atualizar o orientador!');
        }
      });
  }


}
