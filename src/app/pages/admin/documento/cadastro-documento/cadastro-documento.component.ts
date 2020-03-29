import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Curso } from 'src/app/core/model/curso.model';
import { Subscription, Observable } from 'rxjs';
import { Orientador } from 'src/app/core/model/orientador.model';
import { startWith, map } from 'rxjs/operators';
import { SubArea } from 'src/app/core/model/sub-area.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips'
import { Documento } from 'src/app/core/model/documento.model';
import { Autor } from 'src/app/core/model/autor.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CursoService } from 'src/app/core/services/curso.service';
import { OrientadorService } from 'src/app/core/services/orientador.service';
import { SubAreaService } from 'src/app/core/services/sub-area.service';
import { DocumentoService } from 'src/app/core/services/documento.service';
import { Title } from '@angular/platform-browser';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';

@Component({
  selector: 'app-cadastro-documento',
  templateUrl: './cadastro-documento.component.html',
  styleUrls: ['./cadastro-documento.component.css']
})
export class CadastroDocumentoComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  formCadastroDoc: FormGroup;
  cursos: Curso[] = [];
  orientadores: Orientador[] = [];
  subAreas: SubArea[] = [];
  filteredOrientadores: Observable<Orientador[]>;
  filteredCoorientadores: Observable<Orientador[]>;
  filteredCursos: Observable<Curso[]>;
  filteredSubAreas: Observable<SubArea[]>;

  controlSubAreaInput = new FormControl();
  subAreasAdded: SubArea[] = [];
  palavrasChave: string[] = [];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private cursoService: CursoService,
              private orientadorService: OrientadorService,
              private subAreaService: SubAreaService,
              private documentoService: DocumentoService,
              private configService: ConfiguracaoService,
              private toastr: ToastrService,
              private router: Router,
              private titleService: Title) { }

  ngOnInit() {
    this.subscriptions.push(
      this.configService.recuperarTituloAplicacao()
        .subscribe(response => this.titleService.setTitle(response.body + ' - Depósito'))
    );

    this.subscriptions.push(
      this.cursoService.listarTodos().subscribe(
        response => {
          this.cursos = response.body;
        }, error => {

        }
      )
    );
    this.subscriptions.push(
      this.orientadorService.listarTodos().subscribe(
        response => {
          this.orientadores = response.body;
        }, error => {

        }
      )
    );

    this.subscriptions.push(
      this.subAreaService.listar().subscribe(
        response => {
          this.subAreas = response.body;
        }, err => {

        }
      )
    );

    this.formCadastroDoc = new FormGroup({
      titulo: new FormControl(null, Validators.required),
      autor: new FormControl(null, Validators.required),
      matricula: new FormControl(null, Validators.required),
      curso: new FormControl(null, Validators.required),
      orientador: new FormControl(null, Validators.required),
      coorientador: new FormControl(null),
      dataApresentacao: new FormControl(null, Validators.required),
      subAreas: new FormControl(null, Validators.required),
      palavrasChave: new FormControl(null, Validators.required),
      isbn: new FormControl(null),
      arquivo: new FormControl(null, Validators.required),
    });

    this.filteredCursos = this.formCadastroDoc.get('curso').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nome),
        map(nome => nome ? this._filterCurso(nome) : this.cursos.slice())
      );
    this.filteredOrientadores = this.formCadastroDoc.get('orientador').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nome),
        map(nome => nome ? this._filterOrientador(nome) : this.orientadores.slice())
      );

    this.filteredCoorientadores = this.formCadastroDoc.get('coorientador').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nome),
        map(nome => nome ? this._filterOrientador(nome) : this.orientadores.slice())
      );

    this.filteredSubAreas = this.controlSubAreaInput.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nome),
        map(nome => nome ? this._filterSubArea(nome) : this.subAreas.slice())
      );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  cadastrar() {
    let doc = new Documento();
    let autor = new Autor(this.formCadastroDoc.get('autor').value, this.formCadastroDoc.get('matricula').value);
    doc.titulo = this.formCadastroDoc.get('titulo').value;
    doc.autor = autor;
    doc.curso = this.formCadastroDoc.get('curso').value;
    doc.orientador = this.formCadastroDoc.get('orientador').value;
    if(this.formCadastroDoc.get('coorientador').value != null
          && this.formCadastroDoc.get('coorientador').value != '') {
      doc.coorientador = this.formCadastroDoc.get('coorientador').value ;
    } else {
      doc.coorientador = null;
    }
    doc.dataApresentacao = this.formCadastroDoc.get('dataApresentacao').value.format("DD/MM/YYYY");
    doc.subAreas = this.formCadastroDoc.get('subAreas').value
    doc.palavrasChave = this.formCadastroDoc.get('palavrasChave').value
    if(this.formCadastroDoc.get('isbn').value != null && this.formCadastroDoc.get('isbn').value != '') {
      doc.isbn = this.formCadastroDoc.get('isbn').value
    } else { doc.isbn = null; }

    const upload = this.formCadastroDoc.get('arquivo').value
    this.subscriptions.push(
      this.documentoService.cadastrar(doc, upload)
        .subscribe(response => {
          this.toastr.success('Documento cadastrado!');
          this.router.navigate(['/admin/gerenciardocumentos']);
        }, err => {
          const errorMessage =  err.headers.get('errorMessage');
          if(errorMessage != null){
            this.toastr.error(errorMessage,'Erro ao cadastrar');
          }else{
            this.toastr.error('Não foi possível cadastrar o documento','Erro ao cadastrar');
          }
        })
    );
  }

  handleFileInput(files: FileList) {
    this.formCadastroDoc.controls['arquivo'].setValue(files.item(0));
  }


  private _filterCurso(value: string): Curso[] {
    const filterValue = value.toLowerCase();
    return this.cursos.filter(curso => curso.nome.toLowerCase().includes(filterValue));
  }

  private _filterOrientador(value: string): Orientador[] {
    const filterValue = value.toLowerCase();
    return this.orientadores.filter(orientador => orientador.nome.toLowerCase().includes(filterValue));
  }

  private _filterSubArea(value: string): SubArea[] {
    const filterValue = value.toLowerCase();
    return this.subAreas.filter(subArea => subArea.nome.toLowerCase().includes(filterValue));
  }

  displayCurso(curso?: Curso): string | undefined {
    return curso ? curso.nome : undefined;
  }

  displayOrientador(orientador?: Orientador): string | undefined {
    return orientador ? orientador.nome : undefined;
  }

  displaySubArea(sub?: SubArea): string | undefined {
    return sub ? sub.nome : undefined;
  }

  addSubArea(){
    const value = this.controlSubAreaInput.value;
    if (value !== null || value !== '') {
      this.subAreasAdded.push(this.controlSubAreaInput.value);
      this.formCadastroDoc.controls['subAreas'].setValue(this.subAreasAdded);
      this.controlSubAreaInput.setValue('');
    }
  }
  removerSubArea(sub: SubArea){
    const index = this.subAreasAdded.indexOf(sub);
    if (index > -1) {
      this.subAreasAdded.splice(index, 1);
      this.formCadastroDoc.controls['subAreas'].setValue(this.subAreasAdded);
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.palavrasChave.push(value.trim());
      this.formCadastroDoc.controls['palavrasChave'].setValue(this.palavrasChave);
    }
    if (input) {
      input.value = '';
    }
  }

  remove(chave: string): void {
    const index = this.palavrasChave.indexOf(chave);

    if (index >= 0) {
      this.palavrasChave.splice(index, 1);
      this.formCadastroDoc.controls['palavrasChave'].setValue(this.palavrasChave);
    }
  }

}
