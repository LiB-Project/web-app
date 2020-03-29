import { Component, OnInit, OnDestroy } from '@angular/core';
import { Curso } from 'src/app/core/model/curso.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GrandeArea } from 'src/app/core/model/grande-area.model';
import { PageEvent } from '@angular/material';
import { CursoService } from 'src/app/core/services/curso.service';
import { GrandeAreaService } from 'src/app/core/services/grande-area.service';
import { Title } from '@angular/platform-browser';
import { EnumValues } from 'enum-values';
import { NivelCurso } from 'src/app/core/model/nivelCurso.enum';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';

@Component({
  selector: 'list-curso',
  templateUrl: './cursolist.component.html',
  styleUrls: ['./cursolist.component.css']
})
export class CursoListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  cursos: Curso[];
  cursoAberto: Curso;
  formGroupEdit: FormGroup;
  grandesAreas: GrandeArea[] = [];
  todosOsNiveis: any[];

  // pagination items
  pageEvent: PageEvent;

  constructor(private cursoService: CursoService,
              private grandeAreaService: GrandeAreaService,
              private titleService: Title,
              private configService: ConfiguracaoService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.todosOsNiveis = this.listarTodosOsNiveis();

    this.subscriptions.push(
      this.configService.recuperarTituloAplicacao()
        .subscribe(response => this.titleService.setTitle(response.body + ' - Gerenciar cursos'))
    );

    this.pageEvent = new PageEvent();
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 10;

    this.carregarCursos();
    this.carregarGrandesAreas();
    this.formGroupEdit = new FormGroup({
      sigla: new FormControl('', Validators.required),
      nome: new FormControl('', Validators.required),
      nivel: new FormControl(null, Validators.required),
      descricao: new FormControl('', Validators.required),
      codigoGrandeArea: new FormControl('', Validators.required)
    });
  }
  carregarGrandesAreas() {
    this.subscriptions.push(
      this.grandeAreaService.listar().subscribe(
        response => {
          this.grandesAreas = response.body;
        }, error => {

        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  abreCurso(curso: Curso): void {
    this.cursoAberto = curso;
    this.formGroupEdit.get('sigla').setValue(this.cursoAberto.sigla);
    this.formGroupEdit.get('nome').setValue(this.cursoAberto.nome);
    this.formGroupEdit.get('descricao').setValue(this.cursoAberto.descricao);
    this.formGroupEdit.get('codigoGrandeArea').setValue(this.cursoAberto.grandeArea.codigo);
    this.formGroupEdit.get('nivel').setValue(this.cursoAberto.nivel);
  }

  atualizarCurso(): void {
    this.cursoAberto.nome = this.formGroupEdit.get('nome').value;
    this.cursoAberto.sigla = this.formGroupEdit.get('sigla').value;
    this.cursoAberto.descricao = this.formGroupEdit.get('descricao').value;
    this.cursoAberto.grandeArea.codigo = this.formGroupEdit.get('codigoGrandeArea').value;
    this.cursoAberto.nivel = this.formGroupEdit.get('nivel').value;
    this.subscriptions.push(this.cursoService.atualizar(this.cursoAberto)
      .subscribe(response => {
        this.toastr.success('Curso atualizado!');
        this.carregarCursos();
      }, err => {

      }));
  }

  deletarCurso(): void {
    this.subscriptions.push(this.cursoService.deletar(this.cursoAberto.id)
      .subscribe(data => {
        this.carregarCursos();
      }, err => {

      }));
  }

  carregarCursos(): void {
    console.log(this.pageEvent);
    this.subscriptions.push(this.cursoService.listar(this.pageEvent.pageIndex, this.pageEvent.pageSize).subscribe(response => {
      this.pageEvent.length = Number(response.headers.get('X-Total-Count'));
      this.cursos = response.body;
    }, err => {
    }));
  }

  setEvent(event: PageEvent): void {
    this.pageEvent = event;
    this.carregarCursos();
  }

  listarTodosOsNiveis(): any[] {
    return EnumValues.getNamesAndValues(NivelCurso);
  }

}
