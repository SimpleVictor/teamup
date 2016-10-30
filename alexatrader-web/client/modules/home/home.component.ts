import { Component } from "@angular/core";
import * as CONFIGS from "../../myconfig";

declare var firebase;

@Component({
    selector: "home",
    styleUrls: [`client/modules/home/home.component.css`],
    templateUrl: `client/modules/home/home.component.html`
})
export class HomeComponent {


    constructor() {
        var config = {
            apiKey: CONFIGS.myConfigs.apiKey,
            authDomain: CONFIGS.myConfigs.authDomain,
            databaseURL: CONFIGS.myConfigs.databaseURL,
            storageBucket: "",
            messagingSenderId: CONFIGS.myConfigs.messagingSenderId
        };
        firebase.initializeApp(config);


    }


}
