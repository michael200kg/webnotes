import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, MenuController, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { EditNote } from '../pages/edit/edit.note';
import { ViewNote } from '../pages/view/view.note';
import { Notes } from '../pages/notes/notes';
import { UserModel } from '../model/user.model'

import { UserPropsFileService } from '../service/user.props.service';
import { UserPropsModel } from '../model/user.props.model'

@Component({
  templateUrl: 'app.html',
    providers: [UserPropsFileService]
})
export class MyApp implements OnInit {
  
  @ViewChild('content') navCtrl: NavController;

  rootPage: any = Notes;
  username: string;// = "MICHAEL";  
  users: UserModel[];
    
  pages: Array<{title: string, component: any, archive: boolean, icon: string}>;
    
  userProps: UserPropsModel;// = new UserPropsModel("MICHAEL");  
    
  constructor(public platform: Platform,public menuCtrl: MenuController,public propsService: UserPropsFileService) {
    this.initializeApp();
      
      this.users = new Array<UserModel>(); 
      this.users.push(new UserModel("MICHAEL","Михаил")); 
      this.users.push(new UserModel("KOSHKA","Женя"));  
      
      this.propsService.readUserProps().then(value=>{ this.setInitialParams(value);
                                                    }).catch(error=>{ console.log("Error="+error);
                                                                      this.setUserInfo(new UserPropsModel("MICHAEL"));
                                                                      this.setInitialParams(new UserPropsModel("MICHAEL"));             
                                                                     });
  
     

     this.pages = [
        { title: 'Заметки', component: Notes, archive: false, icon: "albums" },
        { title: 'Архив заметок', component: Notes, archive: true, icon: "archive" }

     ];

  }

  ngOnInit() {
      this.navCtrl.setRoot(Notes,{archive: false, title: 'Заметки', username: this.username});   // -----
  }      
    
  setInitialParams(userProps: UserPropsModel) {
     this.userProps=userProps;
     this.username=userProps.username;
     this.navCtrl.setRoot(Notes,{archive: false, title: 'Заметки', username: userProps.username});      
  }  
    
  setUserInfo(userProps: UserPropsModel) {  
     this.propsService.writeUserProps(userProps);
  }  
  getUserInfo() {
     this.propsService.readUserProps().then(value=>{this.userProps=value;console.log("READED USER PROPS = "+JSON.stringify(this.userProps))}).catch(error=>{console.log("Error="+error)});
      
  }      

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
  
  onUserChange() {
      this.propsService.writeUserProps(new UserPropsModel(this.username));
      this.menuCtrl.close();
      this.navCtrl.setRoot(Notes,{archive: false, title: 'Заметки', username: this.username});
  }    
    
  openPage(page) {
      this.navCtrl.setRoot(page.component,{archive: page.archive, title: page.title, username: this.username});
  }
  
  exitApp() {
    this.platform.exitApp();
  }      
    
}
