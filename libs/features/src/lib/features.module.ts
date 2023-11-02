import {CommonModule, DatePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {Route} from '@angular/router';

import {ScenariosComponent} from './scenarios/scenarios.component';
import {DevicesComponent} from './devices/devices.component';
import {FeedsComponent} from './feeds/feeds.component';

@NgModule({
  providers: [
    DatePipe,
  ],
  imports: [
    CommonModule,
  ],
  declarations: [
    ScenariosComponent,
    DevicesComponent,
    FeedsComponent,
  ],
})
