import {Component, NgZone} from "@angular/core";
import * as CONFIGS from "../../myconfig";
import {FirebaseService} from "../../providers/firebase-service";

declare var firebase;

@Component({
    selector: "home",
    styleUrls: [`client/modules/home/home.component.css`],
    templateUrl: `client/modules/home/home.component.html`
})
export class HomeComponent {

    zone;

    constructor(public firebase_service: FirebaseService) {
        var config = {
            apiKey: CONFIGS.myConfigs.apiKey,
            authDomain: CONFIGS.myConfigs.authDomain,
            databaseURL: CONFIGS.myConfigs.databaseURL,
            storageBucket: "",
            messagingSenderId: CONFIGS.myConfigs.messagingSenderId
        };
        firebase.initializeApp(config);


        this.zone = new NgZone({enableLongStackTrace: false});
        let valueChanged = firebase.database().ref("/Listener");

        valueChanged.on("value", (snapshot) => {

            let obj = snapshot.val();
            console.log(obj);


            this.zone.run(() => {
                Object.keys(obj).forEach((key) => {
                    if(obj[key].active === 1){
                        this[key](key, obj);
                    }
                });
            });

        });


    }



    refreshSkill(skill){
        this.firebase_service.Refresh_ActiveSkill(skill).subscribe(
            (data) => {
                console.log("Sucessfylly changed the data");
            }, (err) => {
                console.log(err);
            }
        );
    }


    SetupNumber(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

}
