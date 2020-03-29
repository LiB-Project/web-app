import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {BreadCrumb} from '../value/bread-crumb.value';
import {filter, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalizacaoService {

  private localizacaoList = new Subject<BreadCrumb[]>();


  constructor() {
    this.localizacaoList.next([]);
  }

  adicionar(breadCrumb: BreadCrumb) {
    this.localizacaoList.asObservable()
      .subscribe(breads => {
        const isPresent = breads.some(item => item.label === breadCrumb.label);
        if (!isPresent) {
          breads.push(breadCrumb);
          this.localizacaoList.next(breads);
        }
      });
  }

  limpar() {
    this.localizacaoList.next([]);
  }

  getLocalizacaoList(): Observable<BreadCrumb[]> {
    return this.localizacaoList.asObservable();
  }
}
