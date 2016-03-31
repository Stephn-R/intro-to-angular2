import {Injectable, Inject} from 'angular2/core';
import {Subject}    from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Router} from 'angular2/router';

import {JWTService} from '../../common/services/jwt.service';
import {UserServiceInterface} from '../../common/services/definitions/user.d.ts';

import {APP_CONSTANTS} from '../constants/app.constants';

let headers = new Headers({ 'Content-Type': 'application/json' });
let options = new RequestOptions({ headers: headers });

@Injectable()
export class UserService implements UserServiceInterface {

  private _usersURL = '/users';
  private _errors : Subject<Object>;
  private _user : Subject<Object>;

  public errorsAnnounced$ : Observable<Object>;
  public userAnnounced$ : Observable<Object>;

  constructor (private _router : Router, private http: Http, private _jWTService: JWTService) {
    this._jWTService = _jWTService;
    this._errors = new Subject<Object>();
    this._user = new Subject<Object>();
    this.errorsAnnounced$ = this._errors.asObservable();
    this.userAnnounced$ = this._user.asObservable();
  }

  update(fields: any) {
    return this.http.put(`${APP_CONSTANTS}/user`, JSON.stringify({ user: fields }))
    .toPromise().then(res => {
      this.announcedUserUpdate(res.json().user);
    }).catch(err => {
      this.announceErrors(err.json());
    });
  }

  attemptAuth(type: string, formData: any) {
    let route = (type === 'login') ? `${this._usersURL}/login` : this._usersURL;
    return this.http.post(`${APP_CONSTANTS.api}/${route}`, formData, options).toPromise()
    .then(res => {
      this._jWTService.save(res.json().user.token);
      this.announcedUserUpdate(res.json().user);
      this._router.navigate(['Home']);
    }).catch(err => {
      this.announceErrors(err.json());
    });
  }

  announceErrors(errors: Object) {
    this._errors.next(errors);
  }

  announcedUserUpdate(user: Object) {
    this._user.next(user);
  }
}
