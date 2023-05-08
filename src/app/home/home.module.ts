import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameComponent } from './game/game.component';
import { RecordsComponent } from './records/records.component';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  declarations: [
    LandingComponent,
    DashboardComponent,
    GameComponent,
    RecordsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: LandingComponent,
        children: [
          {
            path: 'dashboard',
            component: DashboardComponent,
          },
          {
            path: 'game',
            component: GameComponent,
          },
          {
            path: 'records',
            component: RecordsComponent,
          },
        ],
      },
    ]),
    NgApexchartsModule,
    DragDropModule,
    MatMenuModule,
  ],
})
export class HomeModule {}
