import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import 'rxjs/Rx';

@Injectable()
export class FirebaseService {


    constructor(private http: Http) { }

    sendNumberToDB(num){
        let obj = {
            test: "bruh"
        };
        let body = JSON.stringify(obj);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        this.http.put(`https://alexatrader-e9921.firebaseio.com/${num}/.json`, body, options).map((res: Response) => res.json())
            .subscribe(
                (data) => {
                    console.log("Sending Number to Firebase...");
                }, (err) => {
                    console.log(err);
                }
            );
    }


    Refresh_ActiveSkill(skill){
        console.log(`Trying to refresh ${skill} now...`);
        let obj = {
            active: 0
        };
        let body = JSON.stringify(obj);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.patch(`https://alexatrader-e9921.firebaseio.com/Listener/${skill}/.json`, body, options).map((res: Response) => res.json());
    }



}
