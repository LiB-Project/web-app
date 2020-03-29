import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAuthorization } from 'src/app/core/model/user-authorization';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private URL_RESOURCE = environment.apiBase + environment.loginPath;

  constructor(private http: HttpClient) { }

  login(login: string, password: string): Observable<HttpResponse<UserAuthorization>> {
    const data = {
      login: `${login}`,
      senha: `${password}`
    };
    return this.http.post(this.URL_RESOURCE, data, {observe: 'response'});
  }

  getDataUser(authorization: string): Observable<HttpResponse<UserAuthorization>> {
    return this.http.get(`${environment.apiBase}${environment.usuarioPath}/data`,
      { observe: 'response', headers: { Authorization : authorization } });
  }


}
