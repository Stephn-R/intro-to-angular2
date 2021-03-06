/*=============================================>>>>>
= REQUIRED MODULES =
===============================================>>>>>*/

import {NgIf} from 'angular2/common';

import {Component, AfterContentChecked, OnDestroy} from 'angular2/core';
import {Router, Location, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription} from 'rxjs/Subscription';

import {UserService} from '../services/user.service';
import {User} from '../../auth/components/user';

/*= End of REQUIRED MODULES =*/
/*=============================================<<<<<*/

@Component({
  selector:    'app-header',
  templateUrl: 'src/app/common/components/layout/appHeader.html',
  directives:  [NgIf, ROUTER_DIRECTIVES],
  providers:   [UserService]
})
export class AppHeader implements AfterContentChecked, OnDestroy {
  public appName: string;
  public user: User;
  public userExists: boolean;

  private userSubscription: Subscription;

  constructor(private _router: Router, private _location: Location, private _userService: UserService) {
    this.appName = 'conduit';
    this.user = new User();

    this.userExists = false;

    this.userSubscription = this._userService.userAnnounced$.subscribe(
      user => {
        this.user = user;
      }
    );
  }

  /*=============================================>>>>>
  = HELPERS =
  ===============================================>>>>>*/

  isActive(component: string) {
    return this._router.hostComponent.name === component;
  }

  isAuthorized(condition: boolean) {
    return !(this._userService.isAuthorized() !== condition);
  }

  imageExists() {
    return this.user.image ? this.user.image.length > 0 : false;
  }

  /*= End of HELPERS =*/
  /*=============================================<<<<<*/

  ngAfterContentChecked() {
    if(this.user.id === 0 && !this.userExists && this._userService.isAuthorized()) {
      // Lock the loop and fetch the user once
      this.userExists = true;
      this._userService.getUser();
    }
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
