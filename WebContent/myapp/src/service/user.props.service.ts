import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { UserPropsModel } from '../model/user.props.model';
import { Platform } from 'ionic-angular';

declare var cordova: any;

@Injectable() 
export class UserPropsFileService {

    //file: File;
   readedProps: string; 
   returnedProps: UserPropsModel;
   //readed: boolean;
        
   constructor( private platform: Platform,
                private file: File) {  
   } 
    
   dataDirectory: string = cordova.file.dataDirectory;
   propertyFileName: string = "user_props.json";
   appRootFolder: string;
    //fs:string = this.cordova.file.dataDirectory;
    
   writeUserProps(props: UserPropsModel) {
     console.log("write: before platform ready");
     this.platform.ready().then(() => { 
       console.log("Platform ready; dataDirectory="+this.dataDirectory);
       this.file.checkFile(this.file.dataDirectory, this.propertyFileName)
          .then(_ => {  
                        //this.file.listDir(this.file.dataDirectory, '/').then(f=>{console.log("f="+f);});
                        console.log('File exists; put data:'+JSON.stringify(props));
                        this.file.writeFile(this.dataDirectory,this.propertyFileName, JSON.stringify(props), {replace:true})
                                                                        .then(()=>{console.log('File writed');},
                                                                              (error)=>{console.log('File doesnt writed: '+error);})
              
                        
          
                     })
          .catch(err => { console.log('File doesnt exist');
                           this.file.writeFile(this.dataDirectory,this.propertyFileName, JSON.stringify(props), {replace:true})
                                                                        .then(()=>{console.log('File writed');},
                                                                              (error)=>{console.log('File doesnt writed: '+error);});});

     });     
   }   

   readUserProps(): Promise<UserPropsModel> {
         console.log('File exists: '+this.dataDirectory);
         return this.file.readAsText(this.dataDirectory,this.propertyFileName).then((text)=>{return this.fromJSON(JSON.parse(text))}); 
   }     

    fromJSON(json: any): UserPropsModel {
        let userPropsModel = Object.create(UserPropsModel.prototype);
        (<any>Object).assign(userPropsModel, json);
        return userPropsModel;
    }    
    
}    