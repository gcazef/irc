import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { RoomService } from 'src/app/services/room.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-chat-channels',
  templateUrl: './chat-channels.component.html',
  styleUrls: ['./chat-channels.component.scss']
})
export class ChatChannelsComponent implements OnInit {
  private currRoom = "";
  private newRoom = "";
  private rooms: string[] = [];
  private joinedRooms: string[] = [];
  private chatSub: Subscription;
  private userSub: Subscription;
  private roomSub: Subscription;

  constructor(
    private chatService: ChatService,
    private roomService: RoomService,
    private dialog: MatDialog
  ) { }

  openDialog(room: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {oldRoom: room};
    
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => console.log("Dialog output:", data)
  );
  }

  ngOnInit() {
    this.chatSub = this.chatService
      .getRoomEvent()
      .subscribe((event) => {
        var chan = event.data.channel;
        if (event.type === "new" && !(this.rooms.includes(chan))) {
          this.rooms.push(chan);
        }
      });

    this.userSub = this.chatService
      .getUserEvent()
      .subscribe((event) => {
        if (event.type === "join") {
          this.roomService.switchRoom(event.data);
        }
      });

    this.roomSub = this.chatService
      .roomsList()
      .subscribe((rooms) => {
        this.rooms = [];
        rooms.forEach(r => {
          this.rooms.push(r.name);
        });
      });
    
    this.chatService.getAllRooms();
  }

  ngOnDestroy() {
    this.chatSub.unsubscribe();
    this.userSub.unsubscribe();
    this.roomSub.unsubscribe();
  }

  public createRoom() {
    if (this.newRoom.length > 0 && this.newRoom.length < 25 && this.newRoom.match("^[A-z0\-9-éè]+$")) {
      this.newRoom = "#" + this.newRoom;
      if (!this.rooms.includes(this.newRoom)) {
        this.chatService.createRoom(this.newRoom);
      }
      this.newRoom = "";
    }
  }
  
  public deleteRoom(room: string) {
    const index: number = this.rooms.indexOf(room);
    if (index !== -1) {
      this.chatService.deleteRoom(room);
      this.rooms.splice(index, 1);
      this.currRoom = "";
    }
  }

  public join(room: string) {
    if (!this.joinedRooms.includes(room)) {
      this.chatService.join(room);
      this.joinedRooms.push(room);
      this.currRoom = room;
    }
  }

  public leave(room: string) {
    const idx = this.joinedRooms.indexOf(room);

    if (idx !== -1) {
      this.chatService.leave(room);
      this.joinedRooms.splice(idx, 1);
      if (room === this.currRoom) {
        this.roomService.switchRoom({channel: null});
        this.currRoom = "";
      }
    }
  }

  // edit(room: string, name: string)

}
