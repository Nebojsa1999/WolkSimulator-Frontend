import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";
import {ScenariosComponent} from "../../../../libs/features/src/lib/scenarios/scenarios.component";
import {DevicesComponent} from "../../../../libs/features/src/lib/devices/devices.component";
import {FeedsComponent} from "../../../../libs/features/src/lib/feeds/feeds.component";

export const SCENARIO_ROUTING = 'scenario';
export const DEVICE_ROUTING = 'device';
export const FEED_ROUTING = 'feed';
const routes: Routes = [
  {path: `${SCENARIO_ROUTING}`, component: ScenariosComponent},
  {path: `${DEVICE_ROUTING}`, component: DevicesComponent},
  {path: `${FEED_ROUTING}`, component: FeedsComponent},];


@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
