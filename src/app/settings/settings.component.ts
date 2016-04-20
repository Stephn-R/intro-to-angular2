/*=============================================>>>>>
= REQUIRED MODULES =
===============================================>>>>>*/

import {Component, OnInit, OnDestroy} from 'angular2/core';
import {NgModel, FORM_DIRECTIVES, FormBuilder, AbstractControl, ControlGroup, Control} from 'angular2/common';
import {Router} from 'angular2/router';

import {Subscription} from 'rxjs/Subscription';

import {UserService} from '../common/services/user.service';
import {User} from '../auth/components/user';

import {ListErrorsComponent} from '../common/components/listErrors.component';

/*= End of REQUIRED MODULES =*/
/*=============================================<<<<<*/

@Component({
  selector:    'settings',
  templateUrl: 'src/app/settings/layout/settings.html',
  directives:  [FORM_DIRECTIVES, NgModel, ListErrorsComponent],
  providers:   [UserService]
})
export class SettingsComponent implements OnInit, OnDestroy {
  public isSubmitting: boolean;
  public formData: ControlGroup;
  public errors: any;
  public user: User;

  private userSubscription: Subscription;

  constructor(private _router: Router, private _userService: UserService) {
    this.isSubmitting = false;
    this.user = new User();
    this.errors = {};

    this.userSubscription = this._userService.userAnnounced$.subscribe(
      (user: any) => {
        this.user = user;
      }
    );
  }

  submitForm() {
    this.isSubmitting = true;

    this._userService.update({
      image: this.user.image,
      username: this.user.username,
      bio: this.user.bio,
      email: this.user.email,
      password: this.user.password
    }).then(
      (user) => {
        this.isSubmitting = false;
        this._router.navigate(['Profile', { username: this.user.username }]);
      },
      (err) => {
        this.isSubmitting = false;
        this.errors = err.json().errors;
      }
    )
  }

  logout() {
    this._userService.logout();
  }

  ngOnInit() {
    this._userService.getUser();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
