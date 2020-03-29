import {Component, Input, OnInit} from '@angular/core';
import {LocalizacaoService} from '../../core/services/localizacao.service';
import {BreadCrumb} from '../../core/value/bread-crumb.value';

@Component({
  selector: 'app-localizacao',
  templateUrl: './localizacao.component.html',
  styleUrls: ['./localizacao.component.css']
})
export class LocalizacaoComponent implements OnInit {

  @Input() breadCrumbs: BreadCrumb[] = [];

  constructor() { }

  ngOnInit() {
  }

  exibirMapaDeLocalizacao(): boolean {
    return this.breadCrumbs.length > 0;
  }
}
