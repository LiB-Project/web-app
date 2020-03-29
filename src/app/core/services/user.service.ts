import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private URL_RESOURCE = environment.apiBase + environment.usuarioPath;

  constructor(private http: HttpClient) { }

  listar(page: number, size: number): Observable<HttpResponse<User[]>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', page.toString());
    httpParams = httpParams.append('size', size.toString());
    return this.http.get<User[]>(this.URL_RESOURCE, {params: httpParams, observe: 'response'});
  }

  buscarPorId(id: string): Observable<HttpResponse<User>> {
    return this.http.get<User>(`${this.URL_RESOURCE}/${id}`, {observe: 'response'});
  }

  cadastrar(user: User): Observable<HttpResponse<User>> {
    return this.http.post(this.URL_RESOURCE, user, {observe: 'response'});
  }

  atualizar(atualizado: User): Observable<HttpResponse<User>> {
    return this.http.put(this.URL_RESOURCE, atualizado, {observe: 'response'});
  }

  deletar(login: string): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.URL_RESOURCE}/${login}`, {observe: 'response'});
  }
}
