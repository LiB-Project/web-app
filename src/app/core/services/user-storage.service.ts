import { Injectable } from '@angular/core';
import { UserAuthorization } from 'src/app/core/model/user-authorization';
import { LocalStorageService } from 'ngx-webstorage';

const USER_AUTHORIZATION = 'UserAuthorization';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {

  constructor(private localStorage: LocalStorageService) { }

  signOut() {
    localStorage.removeItem(USER_AUTHORIZATION);
    localStorage.clear();
  }

  public saveUserAuthorization(data: UserAuthorization) {
    localStorage.removeItem(USER_AUTHORIZATION);
    localStorage.setItem(USER_AUTHORIZATION, JSON.stringify(data));
  }

  public getUserAuthorization(): UserAuthorization {
    return JSON.parse(localStorage.getItem(USER_AUTHORIZATION));
  }
}
