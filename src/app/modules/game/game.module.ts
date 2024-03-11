import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components';
import { GameService } from './services/game.service';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
];

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,

    MatButtonModule,
  ],
  providers: [GameService],
})
export class GameModule {}
