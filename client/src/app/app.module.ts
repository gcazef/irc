import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { RouterModule, Routes } from '@angular/router'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatChannelsComponent } from './components/chat-channels/chat-channels.component';
import { ChatFeedComponent } from './components/chat-feed/chat-feed.component';
import { ChatFormComponent } from './components/chat-form/chat-form.component';
import { ChatMembersComponent } from './components/chat-members/chat-members.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'chat', component: HomeComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    ChatChannelsComponent,
    ChatFeedComponent,
    ChatFormComponent,
    ChatMembersComponent,
    ProfileComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
