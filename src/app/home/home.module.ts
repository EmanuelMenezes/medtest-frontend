import { CdkMenuModule } from '@angular/cdk/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameComponent } from './game/game.component';
import { RecordsComponent } from './records/records.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogoComponent } from './records/dialogo/dialogo.component';
import { QuestaoComponent } from './records/questao/questao.component';
import { ExameComponent } from './records/exame/exame.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
@NgModule({
  declarations: [
    LandingComponent,
    DashboardComponent,
    GameComponent,
    RecordsComponent,
    DialogoComponent,
    QuestaoComponent,
    ExameComponent,
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
    DragDropModule,
    CdkMenuModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class HomeModule {}
