/// <reference path="../../typings/main.d.ts"/>

import 'rxjs/Rx';

import {AppComponent}     from './app.component';
import {bootstrap}        from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {Title} from 'angular2/platform/browser';

import {APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {provide} from 'angular2/core';

import {JWTService} from './common/services/jwt.service';
import {SiteTitleService} from './common/services/siteTitle.service';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  Title,
  SiteTitleService,
  JWTService,
  provide(APP_BASE_HREF, {useValue : '/'}),
  // Turn off Hash Strategy in PROD for extra 'fanciness' :)
  provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
