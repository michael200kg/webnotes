import { NoteItemModel } from '../model/note.item.model';

export class NoteModel {
   
   public objId: string; 
    
   public noteId: number; 
   public createdDate: Date;
   public checked: boolean;
   public checkedDate: Date;
   public name: string;
   public text: string;
   public username: string;
   public archive: boolean;  
   public shared:boolean;
   public sharedForUsername:string;
 
   public items: NoteItemModel[];
    
   constructor(noteId: number, username: string) {
      this.createdDate = new Date(Date.now());
      this.checked = false;
      this.noteId = noteId;
      this.checkedDate = null;
      this.username = username;
      this.shared=false; 
      this.archive = false;
            
   }    
       
}    

