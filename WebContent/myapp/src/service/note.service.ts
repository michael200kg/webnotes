import { Injectable }  from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NoteModel } from '../model/note.model';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class NoteService {

    hostname: string = "http://ec2-13-59-41-101.us-east-2.compute.amazonaws.com:8080";
    //hostName: string = "http://79.111.14.182:8888";
    //hostName: string = "http://localhost";

    constructor ( private http: Http,
                  private alertCtrl: AlertController) {}



  public getGeneratedId(): Observable<number> {
      return this.http.get(this.hostName+"/notes/service/notes/generate_note_id")
                        .map(this.extractData)
                        .catch(this.handleError);
  }

  public getNotesByUser(username: string, archive: boolean): Observable<NoteModel[]> {

      let params: URLSearchParams = new URLSearchParams();
      let archive_=archive?"true":"false";
      console.log("archive="+archive_);
      params.set("archive", archive_);
      return this.http.get(this.hostName+"/notes/service/notes/find_by_user/"+username, { search: params })
                        .map(this.extractData)
                        .catch(this.handleError);
  }

  public saveOneNote(note: NoteModel): Observable<string> {
      let body = JSON.stringify(note);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.post(this.hostName+"/notes/service/notes/save_one_note",body ,options)
                        .map(res=>{return res;})
                        .catch(this.handleError);
  }

  public deleteOneNote(noteId: number): Observable<string> {
      //let headers = new Headers({ 'Content-Type': 'application/json' });
      let headers = new Headers({ 'Content-Type': 'text/plain' });
      let options = new RequestOptions({ headers: headers });
      return this.http.delete(this.hostName+"/notes/service/notes/"+noteId.toString()+"/delete_one_note")
                               .map(res=>{ console.log("res="+res);
                                   return res; })
                               .catch(this.handleError);
  }

  public setCheckedItem(noteId: number, itemId: number, checked: boolean): Observable<string> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let checked_ = checked?"true":"false";
      return this.http.post(this.hostName+"/notes/service/notes/"+noteId.toString()+"/item/"+itemId.toString()+"/set_checked_item/"+checked_,"{}" ,options)
                        .map(res=>{return res;})
                        .catch(this.handleError);
  }

  public setArchive(noteId: number, archive: boolean): Observable<string> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let archive_ = archive?"true":"false";
      return this.http.post(this.hostName+"/notes/service/notes/"+noteId.toString()+"/set_archive/"+archive_,"{}" ,options)
                        .map(res=>{return res;})
                        .catch(this.handleError);
  }

  private extractData(res: Response) {
    console.log("res: "+res);
    let body = res.json();
    console.log("body: "+body);
    return body;
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);

    return Observable.throw(errMsg);
  }



}
