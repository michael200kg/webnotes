import { Component, OnInit } from '@angular/core';

import { NavController, NavParams, Platform } from 'ionic-angular';

import { NoteModel } from '../../model/note.model';
import { UserModel } from '../../model/user.model';

import { NoteService } from '../../service/note.service';
import { UserPropsFileService } from '../../service/user.props.service';
import { UserPropsModel } from '../../model/user.props.model'

import {EditNote} from '../../pages/edit/edit.note'
import {ViewNote} from '../../pages/view/view.note'

import { AlertController } from 'ionic-angular';

@Component({
  selector: 'notes',
  templateUrl: 'notes.html',
  styleUrls: ['/scss/note.scss'],
  providers: [NoteService,UserPropsFileService]
})
export class Notes implements OnInit {

  archive: boolean;  
    
 
  notes: NoteModel[];
  
  note: NoteModel;   
  username: string;  
    
  title: string;  
    
  errorMessage: string;  
  
  //userProps: UserPropsModel = new UserPropsModel("MICHAEL");
    
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public service: NoteService,
              public alertCtrl: AlertController,
              public platform: Platform,
              public propsService: UserPropsFileService  ) {
          
      this.title = navParams.get('title');
      this.archive = navParams.get('archive');
      this.note = navParams.get('note');
      this.username = navParams.get('username');


  }

   ngOnInit() {
      console.log("on init username="+this.username); 
       this.username = (this.username==null)||(typeof this.username === 'undefined')  ? "MICHAEL" : this.username;
       
       //this.username=this.username==null?this.users[0].username:this.username;  
       console.log("on init user="+this.username);  
 
       this.reloadData();
   }    
    
   reloadData() {
      this.service.getNotesByUser(this.username,this.archive)
                 .subscribe(notes => {this.notes = this.sortNotes(notes); this.notes.forEach(note=>note.checkedDate=new Date(note.checkedDate));}, error =>  this.errorMessage = <any>error );    
       
   } 
    
   itemTapped(note) {
      this.navCtrl.push(ViewNote, { note: note, archive: this.archive, title: this.title, username: this.username });
   }
   
    refreshView() {
      this.navCtrl.setRoot(Notes, { note: this.note, archive: this.archive, title: this.title, username: this.username }); 
    }    
    
    deleteOneNote(note: NoteModel) {      
       this.showConfirm(note);
        //this.service.deleteOneNote(note.noteId).subscribe(error=> {this.errorMessage = <any>error;this.refreshView();});      
   }    
    
   exit() {
      this.platform.exitApp();
       //this.navCtrl.exitApp();
   } 
    
    addOneNote() {
       //console.log("start!");
       let nextId:number = 0;
       this.service.getGeneratedId().subscribe(res=>{nextId=res}); 
       //console.log("nextId="+nextId);
       let note: NoteModel = new NoteModel(nextId,this.username);
       this.navCtrl.push(EditNote, { note: note, archive: this.archive, title: this.title, username: this.username  });
   }       
  
    archiveNote(note:NoteModel) {
       this.service.setArchive(note.noteId, note.archive?false:true).subscribe( error=>{this.reloadData();} ); 
    }       
    
   showConfirm(note: NoteModel) {
    let confirm = this.alertCtrl.create({
      title: 'Подтверждение удаления?',
      message: 'Вы действительно хотите удалить эту заметку?',
      buttons: [
        {
          text: 'Да',
          handler: () => {
                          //this.alertMsg("Alert","Notes:deleteOneNote before service");
                          this.service.deleteOneNote(note.noteId).subscribe(error=> {this.errorMessage = <any>error;this.refreshView();});
                          //this.alertMsg("Alert","Notes:deleteOneNote after service");
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
  
  sortNotes(notes: NoteModel[]): NoteModel[] {
     let notesChecked: NoteModel[] = notes.filter(note=>(note.checked));
     let notesResult: NoteModel[] = notes.filter(note=>(!note.checked));
     notesChecked.forEach(note=>{notesResult.push(note)}); 
     return notesResult; 
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
    

