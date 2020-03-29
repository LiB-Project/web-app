import {Component, OnDestroy, OnInit} from '@angular/core';
import {DocumentoService} from '../../../../core/services/documento.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Documento} from '../../../../core/model/documento.model';
import {Observable, Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Curso} from '../../../../core/model/curso.model';
import {Orientador} from '../../../../core/model/orientador.model';
import {SubArea} from '../../../../core/model/sub-area.model';
import {map, startWith} from 'rxjs/operators';
import {SubAreaService} from '../../../../core/services/sub-area.service';
import {OrientadorService} from '../../../../core/services/orientador.service';
import {CursoService} from '../../../../core/services/curso.service';
import {MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Autor } from 'src/app/core/model/autor.model';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.css']
})
export class EditDocumentComponent implements OnInit, OnDestroy {

  doc: Documento;
  private subscriptions: Subscription[] = [];

  formEdit: FormGroup;

  filteredCursos: Observable<Curso[]>;
  filteredOrientadores: Observable<Orientador[]>;
  filteredCoorientadores: Observable<Orientador[]>;
  filteredSubAreas: Observable<SubArea[]>;

  cursos: Curso[] = [];
  orientadores: Orientador[] = [];
  subAreas: SubArea[] = [];
  controlSubAreaInput = new FormControl();
  subAreasAdded: SubArea[] = [];
  palavrasChave: string[] = [];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private documentoService: DocumentoService,
              private subAreaService: SubAreaService,
              private orientadorService: OrientadorService,
              private cursoService: CursoService,
              private route: ActivatedRoute,
              private titleService: Title,
              private toastr: ToastrService,
              private configService: ConfiguracaoService,
              private router: Router) { }

  ngOnInit() {
    this.subscriptions.push(
      this.configService.recuperarTituloAplicacao()
            .subscribe(response => this.titleService.setTitle(response.body + ' - Editar documento'))
    );

    this.formEdit = new FormGroup({
      titulo: new FormControl(null, Validators.required),
      autor: new FormControl(null, Validators.required),
      matricula: new FormControl(null, Validators.required),
      curso: new FormControl(null, Validators.required),
      orientador: new FormControl(null, Validators.required),
      coorientador: new FormControl(null),
      dataApresentacao: new FormControl('', Validators.required),
      subAreas: new FormControl(null, Validators.required),
      palavrasChave: new FormControl(null, Validators.required),
      isbn: new FormControl(null),
    });
    this.subscriptions.push(
      //
      this.route.paramMap.subscribe(params => {
        //
       this.subscriptions.push(
         this.documentoService.getById(params.get('documentId')).subscribe(
           data => {
               this.doc = data.body;
               this.carregarFormGroupComValores();
           }, err => {

           })
       )
      })
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
  }

  atualizarDocumento(): void {
    const autor = new Autor(this.formEdit.get('autor').value, this.formEdit.get('matricula').value);
    this.doc.titulo = this.formEdit.get('titulo').value;
    this.doc.autor = autor;
    this.doc.curso = this.formEdit.get('curso').value;
    this.doc.orientador = this.formEdit.get('orientador').value;
    if(this.formEdit.get('coorientador').value != null && this.formEdit.get('coorientador').value != ''){
      this.doc.coorientador = this.formEdit.get('coorientador').value ;
    } else {
      this.doc.coorientador = null;
    }
    this.doc.dataApresentacao = this.formEdit.get('dataApresentacao').value.format("DD/MM/YYYY");
    this.doc.subAreas = this.formEdit.get('subAreas').value
    this.doc.palavrasChave = this.formEdit.get('palavrasChave').value
    if(this.formEdit.get('isbn').value != null && this.formEdit.get('isbn').value != '') {
      this.doc.isbn = this.formEdit.get('isbn').value
    } else { this.doc.isbn = null; }

    console.log(this.doc);
    this.subscriptions.push(
      this.documentoService.atualizar(this.doc)
        .subscribe(response => {
          this.toastr.success('Documento atualizado!');
          this.router.navigate(['/admin/gerenciardocumentos']);
        }, err => {
          const errorMessage =  err.headers.get('errorMessage');
          if(errorMessage != null){
            this.toastr.error(errorMessage, 'Erro ao atualizar');
          }else{
            this.toastr.error('Não foi possível atualizar o documento', 'Erro ao atualizar');
          }
        })
    );
  }

  private carregarFormGroupComValores(): void {
    this.subAreasAdded = this.doc.subAreas;
    this.palavrasChave = this.doc.palavrasChave;

    this.formEdit.get('titulo').setValue(this.doc.titulo);
    this.formEdit.get('autor').setValue(this.doc.autor.nome);
    this.formEdit.get('matricula').setValue(this.doc.autor.matricula);
    this.formEdit.get('curso').setValue(this.doc.curso);
    this.formEdit.get('orientador').setValue(this.doc.orientador);
    this.formEdit.get('coorientador').setValue(this.doc.coorientador);
    this.formEdit.get('dataApresentacao').setValue(moment(this.doc.dataApresentacao, 'DD/MM/YYYY'));
    this.formEdit.get('subAreas').setValue(this.doc.subAreas);
    this.formEdit.get('palavrasChave').setValue(this.doc.palavrasChave);
    this.formEdit.get('isbn').setValue(this.doc.isbn);

    this.filteredCursos = this.formEdit.get('curso').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nome),
        map(nome => nome ? this._filterCurso(nome) : this.cursos.slice())
      );
    this.filteredOrientadores = this.formEdit.get('orientador').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nome),
        map(nome => nome ? this._filterOrientador(nome) : this.orientadores.slice())
      );

    this.filteredCoorientadores = this.formEdit.get('coorientador').valueChanges
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

  displayCurso(curso?: Curso): string | undefined {
    return curso ? curso.nome : undefined;
  }

  displayOrientador(orientador?: Orientador): string | undefined {
    return orientador ? orientador.nome : undefined;
  }

  displaySubArea(sub?: SubArea): string | undefined {
    return sub ? sub.nome : undefined;
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

  addSubArea(){
    const value = this.controlSubAreaInput.value;
    if (value !== null || value !== '') {
      this.subAreasAdded.push(this.controlSubAreaInput.value);
      this.formEdit.get('subAreas').setValue(this.subAreasAdded);
      this.controlSubAreaInput.setValue('');
    }
  }
  removerSubArea(sub: SubArea){
    const index = this.subAreasAdded.indexOf(sub);
    if (index > -1) {
      this.subAreasAdded.splice(index, 1);
      this.formEdit.get('subAreas').setValue(this.subAreasAdded);
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.palavrasChave.push(value.trim());
      this.formEdit.get('palavrasChave').setValue(this.palavrasChave);
    }
    if (input) {
      input.value = '';
    }
  }

  remove(chave: string): void {
    const index = this.palavrasChave.indexOf(chave);
    if (index >= 0) {
      this.palavrasChave.splice(index, 1);
      this.formEdit.get('palavrasChave').setValue(this.palavrasChave);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
