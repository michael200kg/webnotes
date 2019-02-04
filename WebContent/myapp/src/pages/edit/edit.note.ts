import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { NoteModel } from '../../model/note.model';
import { NoteItemModel } from '../../model/note.item.model';
import { NoteService } from '../../service/note.service';
import { Notes } from '../notes/notes';
import { AlertController } from 'ionic-angular';
import { UserModel } from '../../model/user.model';

@Component({
  selector: 'edit-note',
  templateUrl: 'edit.note.html',
  styleUrls: ['/scss/note.scss'],
  providers: [NoteService]
})
export class EditNote {

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
  
  public saveOneNote() {
      this.service.saveOneNote(this.note).subscribe( error=>{this.exit();} );
  }      
    
  public exit() {
     this.navCtrl.setRoot(Notes, {note: this.note, archive: this.archive, title: this.title, username: this.username});
  } 
    
    showAddFields(show: boolean) {
        this.addingListElement=show;
        this.itemName="";
        this.itemDescription="";   
    }   
    
    addItemElement() {
       if(this.note.items==null) {
          this.note.items = new Array<NoteItemModel>();
       }   
       let nextId=1;
       if(this.note.items!=null) {
          this.note.items.forEach(item=>{nextId=item.itemId>=nextId?item.itemId+1:nextId;}); 
       }
 
       let item: NoteItemModel = new  NoteItemModel(); 
       item.itemId=nextId;
       item.itemName=this.itemName;
       item.itemDescription = this.itemDescription;
       item.checked=false;
       item.checkedDate=new Date(); 
       this.note.items.push(item);  
       this.addingListElement=false;   
    }     
    removeItemElement (id: number) {
       if(this.note.items!=null) {
          this.showConfirm(id); 
       }    
    }    
    toggleShowNames() {
       this.showNames=!this.showNames;
    }
   
    
    showConfirm(id: number) {
       let confirm = this.alertCtrl.create({
       title: 'Подтверждение удаления?',
      message: 'Вы действительно хотите удалить эту строчку?',
      buttons: [
        {
          text: 'Да',
          handler: () => {
            this.note.items = this.note.items.filter(item=>(item.itemId!=id));
          }
        },
        {
          text: 'Нет',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }    

        
}
