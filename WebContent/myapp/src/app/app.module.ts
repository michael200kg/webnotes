import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { EditNote } from '../pages/edit/edit.note';
import { ViewNote } from '../pages/view/view.note';
import { Notes } from '../pages/notes/notes';
import { NoteService } from '../service/note.service';
import {File} from '@ionic-native/file';

@NgModule({
  declarations: [
    MyApp,
    EditNote,
    ViewNote,
    Notes
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EditNote,
    ViewNote,
    Notes
  ],
  providers: [File, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
