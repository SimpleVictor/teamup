import {Component, NgZone} from "@angular/core";
import * as CONFIGS from "../../myconfig";
import {FirebaseService} from "../../providers/firebase-service";
import {myJSON} from "../../json/team";



declare var firebase;
declare var $;
declare var TweenMax;
declare var Bounce;
declare var Circ;
declare var Back;
declare var SlowMo;
declare var TimelineLite;

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

        let robot_circle = $('.torso:before');
        console.log(robot_circle);

        this.refreshSkill(skill);
    }

    //QUERIES
    FindWithSkill(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    FindWhoNeedsTeam(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    FindIndividualName(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    FindDescriptionProject(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    FindSpecificTeam(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    //CHOOSING AN OPTION
    ChooseTeamMember(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    LookUpHisTeamMate(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }


    //REQUESTING
    RequestToTextTeamParty(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    RequestToJoinTeam(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    RequestToTextIndividual(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    //UNIVERSALS COMMANDS
    GoToMainMenu(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    GoBackACommand(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }




}
