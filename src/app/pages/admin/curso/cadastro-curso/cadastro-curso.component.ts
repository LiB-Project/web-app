import { Component, OnInit, OnDestroy } from '@angular/core';
import { Curso } from 'src/app/core/model/curso.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GrandeArea } from 'src/app/core/model/grande-area.model';
import { Router } from '@angular/router';
import { CursoService } from 'src/app/core/services/curso.service';
import { GrandeAreaService } from 'src/app/core/services/grande-area.service';
import { Title } from '@angular/platform-browser';
import { EnumValues } from 'enum-values';
import { NivelCurso } from 'src/app/core/model/nivelCurso.enum';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';

@Component({
  selector: 'app-cadastro-curso',
  templateUrl: './cadastro-curso.component.html',
  styleUrls: ['./cadastro-curso.component.css']
})
export class CadastroCursoComponent implements OnInit, OnDestroy {

  formGroupCadastro: FormGroup;
  private subscriptions: Subscription[] = [];
  grandesAreas: GrandeArea[] = [];
  todosOsNiveis: any[];

  curso: Curso;

  constructor(private cursoService: CursoService,
              private fb: FormBuilder,
              private configService: ConfiguracaoService,
              private grandeAreaService: GrandeAreaService,
              private router: Router,
              private titleService: Title) { }

  ngOnInit() {
    this.subscriptions.push(
      this.configService.recuperarTituloAplicacao()
        .subscribe(response => this.titleService.setTitle(response.body + ' - Cadastro de curso'))
    );

    this.todosOsNiveis = this.listarTodosOsNiveis();
    this.subscriptions.push(
      this.grandeAreaService.listar().subscribe(
        response => {
          this.grandesAreas = response.body;
        }, error => {

        }
      )
    );
    this.curso = new Curso();
    this.curso.grandeArea = new GrandeArea();
    this.formGroupCadastro = new FormGroup({
      sigla: new FormControl(this.curso.sigla, Validators.required),
      nome: new FormControl(this.curso.nome, Validators.required),
      nivel: new FormControl(this.curso.nivel, Validators.required),
      descricao: new FormControl(this.curso.descricao, Validators.required),
      codigoGrandeArea: new FormControl(null, Validators.required)
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  cadastrarCurso(): void {
    this.curso.nome = this.formGroupCadastro.get('nome').value;
    this.curso.sigla = this.formGroupCadastro.get('sigla').value;
    this.curso.descricao = this.formGroupCadastro.get('descricao').value;
    this.curso.grandeArea.codigo = this.formGroupCadastro.get('codigoGrandeArea').value;
    this.curso.nivel = this.formGroupCadastro.get('nivel').value;
    this.subscriptions.push(this.cursoService.cadastrar(this.curso)
      .subscribe(data => {
        this.router.navigate(['/admin/gerenciarcursos']);
      }, err => {

      })
    );
  }

  listarTodosOsNiveis(): any[] {
    return EnumValues.getNamesAndValues(NivelCurso);
  }

}
