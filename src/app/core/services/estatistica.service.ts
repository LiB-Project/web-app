import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {DocumentoAcessos} from '../value/documento-acessos.value';

@Injectable({
  providedIn: 'root'
})
export class EstatisticaService {

  constructor(private http: HttpClient) {
  }

  listarAnoDeDocumentos(): Observable<HttpResponse<number[]>> {
    return this.http.get<number[]>(`${environment.apiBase + environment.estatisticaPath}/ano`,
      {observe: 'response'});
  }

  carregarLevantamento(anoInferior: number, anoSuperior: number, cursoId: string): Observable<HttpResponse<any>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('anoInferior', anoInferior.toString());
    httpParams = httpParams.append('anoSuperior', anoSuperior.toString());
    httpParams = httpParams.append('cursoId', cursoId.toString());
    return this.http.get<any[]>(`${environment.apiBase + environment.estatisticaPath}/evolucao`,
      {observe: 'response', params: httpParams});
  }

  carregarAreas(grandeArea: number): Observable<HttpResponse<any[]>> {
    let httpParams = new HttpParams();
    if (grandeArea != null) {
      httpParams = httpParams.append('grandeArea', grandeArea.toString());
    }

    return this.http.get<any[]>(`${environment.apiBase + environment.estatisticaPath}/area`,
      { observe: 'response', params: httpParams});

  }

  carregarPorOrientador(orientador: string): Observable<HttpResponse<any[]>>{
    let httpParams = new HttpParams();
    httpParams = httpParams.append('id', orientador);
    return this.http.get<any[]>(`${environment.apiBase + environment.estatisticaPath}/orientador`,
      { observe: 'response', params: httpParams});
  }

  carregarQuantidadeAcessos(): Observable<HttpResponse<DocumentoAcessos[]>> {
    return this.http.get<DocumentoAcessos[]>(`${environment.apiBase + environment.estatisticaPath}/acessos`,
      { observe: 'response' });
  }

  countAcesso(id: string): Observable<HttpResponse<null>> {
    return this.http.post<null>(`${environment.apiBase + environment.estatisticaPath}/acesso/${id}`,
      { observe: 'response'});
  }
}
