import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms'
import { ChatService } from '../../services/chat.service'
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  form: FormGroup;
  name:string;
  oldRoom: string;

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<DialogComponent>,
     // private chatChannel: ChatChannelsComponent,
      private chatService: ChatService,
      @Inject(MAT_DIALOG_DATA) data) {
        this.oldRoom = data.oldRoom;

      //this.name = data.name;
  }

  ngOnInit() {
      this.form = this.fb.group({
          name: [name, []]
      });
  }

  save() {
    //this.chatChannel.editRoom(this.name);
      this.dialogRef.close(this.form.value);
  }

  close() {
      this.dialogRef.close();
  }
  public editRoom() {
    if (this.name.length > 0 && this.name.length < 25 && this.name.match("^[A-z0-9\-éè]+$")) {
      this.name = "#" + this.name;
      this.chatService.editRoom(this.oldRoom, this.name);
      this.chatService.getAllRooms();
      this.dialogRef.close(this.form.value);
    }
  }
}
