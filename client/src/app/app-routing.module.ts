import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatChannelsComponent } from './components/chat-channels/chat-channels.component';

const routes: Routes = [
  { path: '', component: ChatChannelsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
