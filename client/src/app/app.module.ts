import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatChannelsComponent } from './components/chat-channels/chat-channels.component';
import { ChatFeedComponent } from './components/chat-feed/chat-feed.component';
import { ChatFormComponent } from './components/chat-form/chat-form.component';
import { ChatMembersComponent } from './components/chat-members/chat-members.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatChannelsComponent,
    ChatFeedComponent,
    ChatFormComponent,
    ChatMembersComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
