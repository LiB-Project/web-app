import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Documento } from '../model/documento.model';
import { environment } from 'src/environments/environment';
import {Recente} from '../value/recente.value';
import {QueryAdvanced} from '../value/query-advanced.value';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService {

  private URL_RESOURCE = environment.apiBase + environment.documentoPath;

  constructor(private http: HttpClient) { }

  cadastrar(doc: Documento, arquivo: File): Observable<HttpResponse<Documento>> {
    const formData = new FormData();
    const metadata = new Blob([JSON.stringify(doc)], {type: 'application/json'});
    formData.append('metadata', metadata);
    formData.append('file', arquivo, arquivo.name);
    return this.http.post(this.URL_RESOURCE, formData, {observe: 'response'});
  }

  atualizar(doc: Documento): Observable<HttpResponse<Documento>> {
    return this.http.put(`${this.URL_RESOURCE}/${doc.id}`, doc, {observe: 'response'});
  }

  listar(page: number, size: number): Observable<HttpResponse<Documento[]>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', page.toString());
    httpParams = httpParams.append('size', size.toString());
    return this.http.get<Documento[]>(this.URL_RESOURCE, { params: httpParams, observe: 'response' });
  }

  deletar(id: string): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.URL_RESOURCE}/${id}`, {observe: 'response'});
  }

  buscarPorLabel(label: string, termo: string, page: number, size: number): Observable<HttpResponse<Documento[]>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('label', label.toLowerCase());
    httpParams = httpParams.append('termo', termo);
    httpParams = httpParams.append('page', page.toString());
    httpParams = httpParams.append('size', size.toString());
    return this.http.get<Documento[]>(`${this.URL_RESOURCE}/search`,
                {params: httpParams, observe: 'response'});
  }

  buscarPorSearchQuery(query: QueryAdvanced, page: number, size: number): Observable<HttpResponse<Documento[]>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', page.toString());
    httpParams = httpParams.append('size', size.toString());
    // const pageable = {
    //   page,
    //   size
    // };
    // httpParams = httpParams.append('pageable', JSON.stringify(pageable));
    return this.http.post<Documento[]>(`${this.URL_RESOURCE}/searchQuery`, query,
      {params: httpParams, observe: 'response'});
  }

  getById(id: string): Observable<HttpResponse<Documento>> {
    return this.http.get<Documento>(`${this.URL_RESOURCE}/${id}`, {observe: 'response'});
  }

  getPublicacoesRecentes(limit: number): Observable<HttpResponse<Recente[]>> {
    return this.http.get<Recente[]>(`${this.URL_RESOURCE}/recentes?limit=${limit}`, { observe: 'response' });
  }

}
