import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { NoteModel } from '../../model/note.model';
import { NoteItemModel } from '../../model/note.item.model';
import { NoteService } from '../../service/note.service';
import { Notes } from '../notes/notes';
import { AlertController } from 'ionic-angular';
import { UserModel } from '../../model/user.model';
import { EditNote } from '../../pages/edit/edit.note';

@Component({
  selector: 'view-note',
  templateUrl: 'view.note.html',
  styleUrls: ['/scss/note.scss'],
  providers: [NoteService]
}) 
export class ViewNote {

  username: string;  
  note: NoteModel;
  error: string;
  archive: boolean;  
  title: string;
    
  itemName: string;
  itemDescription: string;    
    
  addingListElement: boolean = false;
    
  showNames: boolean;  

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private service: NoteService,
              public alertCtrl: AlertController) {
      this.title = navParams.get('title');
      this.archive = navParams.get('archive');
      this.note = navParams.get('note');
      this.username = navParams.get('username');    
      this.showNames = this.note.items==null;

  }
  
  public editOneNote() {
     this.navCtrl.push(EditNote, {  note: this.note, archive: this.archive, title: this.title, username: this.username  });
  }     

  public exit() {
     this.navCtrl.setRoot(Notes, { note: this.note, archive: this.archive, title: this.title, username: this.username });
  } 

  public setChecked(item:NoteItemModel) {
     console.log("setChecked:"+item.checked);
     this.service.setCheckedItem(this.note.noteId, item.itemId, item.checked).subscribe();
  }    
    

  alertMsg(title:string ,message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }  
        
}
